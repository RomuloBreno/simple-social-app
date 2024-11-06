// src/App.tsx
import React, { useState, useEffect } from 'react';
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

const App =  () => {
  document.title = "FdBack"
  const data = useAuth().data || null
  if (data?.token && data?.user) {
    return (
 
      <Router>
         <Header /> 
         
        <br />
        <Routes>

          {/* redirecionamento das rotas que necessitam de login */}
          <Route
            path="/"
            element={<Feed />}
          />
          <Route
            path="/feed"
            element={<Feed />}
          />
          <Route
            path={`/profile`}
            element={<Profile />}
          />
          <Route
            path={`/profile/:profileId`}
            element={ <Profile />}
          />

          <Route path="/login" element={<Navigate to="/feed" />} />
          <Route path="/register" element={<Navigate to="/feed" />} />
        </Routes>
        <br />

          <Footer />

      </Router>
    )

  } else {
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
