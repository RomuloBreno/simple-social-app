// src/App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Home';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './authContext';


const App = () => {
  const user = useAuth();
  return (
    <Router>
        <Header />
      <br />
        <Routes>
          {!user.user
          ?<Route path="/" element={<Index />} />
          :<Route path="/" element={<Feed />} />
          }

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {!user.user 
          ?<Route path="/feed" element={<Index />} />
          :<Route path="/feed" element={<Feed />} />
          }
        </Routes>
      <br />
        <Footer />
    </Router>
  )

};
export default App;
