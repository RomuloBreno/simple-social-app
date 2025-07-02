import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from './context/authContext'; // Importa o hook useAuth
import Header from "./components/Header";
import Footer from "./components/Footer";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import FeedStory from "./pages/FeedStory";
import Index from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifys from "./components/notify/Notifys";

const ProtectedRoute = ({ children }) => {
  const user = useAuth().data?.user;
  return user?._id ? children : <Navigate to="/login" />;
};

const App = () => {
  document.title = "FdBack";
  const {data, wsConnection}= useAuth();
  const user = data?.user;
  const tokenIsValid = data?.validToken;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  }, [messages]);

  return (
    <Router>
      <Header />
      <Notifys login={user ? true : false} webSocket={wsConnection} />
      <br />
      <Routes>
        {/* Rotas públicas para usuários não autenticados */}
        {!user ? (
          <>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/feed" element={<Navigate to="/" />} /> */}
            {/* <Route path="/*" element={<Navigate to="/" />} /> */}
          </>
        ) : (
          <>
            {/* Redireciona usuários autenticados que tentarem acessar rotas públicas */}
            <Route path="/login" element={<Navigate to="/feed" />} />
            <Route path="/register" element={<Navigate to="/feed" />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={<Navigate to="/feed" />} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/profile/:profileNick" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            {/* <Route path="/profile/*" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
            <Route path="/post/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/post-story/:postStoryPatternId" element={<ProtectedRoute><FeedStory /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            {/* <Route path="*" element={<Navigate to="/feed" />} /> */}
          </>
        )}
      </Routes>
      <br />
      <Footer />
    </Router>
  );
};

export default App;
