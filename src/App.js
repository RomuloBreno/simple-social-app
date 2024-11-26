import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import FeedStory from "./pages/FeedStory";
import Index from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = ({userLoged}) => {
  document.title = "FdBack";
  const user = userLoged

  useEffect(() => {
    // Poderia ser usado para configurar algo ao carregar o usuário
    console.log("Usuário atualizado:", user);
  }, [user]);

  return (
    <Router>
      <Header />
      <br />
      <Routes>
        {user?._id ? (
          // Rotas protegidas (usuário logado)
          <>
            <Route path="/" element={<Feed />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/post-story/:postStoryPatternId" element={<FeedStory />} />

            {/* Redireciona rotas específicas quando logado */}
            <Route path="/post" element={<Navigate to="/feed" />} />
            <Route path="/login" element={<Navigate to="/feed" />} />
            <Route path="/register" element={<Navigate to="/feed" />} />
          </>
        ) : (
          // Rotas para usuários não autenticados
          <>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Redireciona rotas protegidas para a página inicial */}
            <Route path="/feed" element={<Navigate to="/" />} />
            <Route path="/profile/*" element={<Navigate to="/" />} />
            <Route path="/post/*" element={<Navigate to="/" />} />
            <Route path="/post-story/*" element={<Navigate to="/" />} />
          </>
        )}
        {/* Rota padrão para rotas não encontradas */}
        <Route path="*" element={<Navigate to={user ? "/feed" : "/"} />} />
      </Routes>
      <br />
      <Footer />
    </Router>
  );
};

export default App;
