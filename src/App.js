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
import { useAuth, UserProvider, useUser } from './context/authContext';
import { factoryUser } from './utils/fetch';

const App =  () => {
  document.title = "FdBack"
  const [userData, setUserData] = useState()
  const token = useAuth() || null
  useEffect(async () => {
    const response = await factoryUser(token?.token?.token)
    setUserData(response)
  }, [])
  if (token?.token && userData?.status) {
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

          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
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
