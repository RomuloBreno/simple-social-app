// src/App.tsx
import React, {} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Home';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useAuth } from './context/authContext';

const App = () => {
  const user = useAuth();
  if(user.user !== null){
    return (
      <Router>
        <Header />
        <br />
        <Routes>
  
          {/* redirecionamento das rotas que necessitam de login */}
       <Route
            path="/"
            element={!user.user ? <Index /> : <Navigate to="/feed" />}
          />
          <Route
            path="/feed"
            element={user.user ? <Feed /> : <Navigate to="/" />}
          />
           <Route
            path={`/profile`}
            element={user.user ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path={`/profile/:profileId`}
            element={user.user ? <Profile /> : <Navigate to="/" />}
          />
  
  {/* profile */}
          <Route
            path={`/profile`}
            element={!user.user ? <Index /> : <Profile/>}
          />
          <Route
            path={`/profile/:profileId`}
            element={!user.user ? <Index /> : <Profile/>}
          />
  
  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <br />
        <Footer />
      </Router>
    )

  }else{
    return (
      <Router>
        <Header />
        <br />
        <Routes> 
          <Route path="/" element={<Index />} />
          <Route path="/feed" element={<Navigate to="/" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <br />
        <Footer />
      </Router>
    )
  }

};
export default App;
