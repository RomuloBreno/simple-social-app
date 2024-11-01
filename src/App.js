// src/App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Home';
import Feed from './pages/Feed';

const App = () => (
  <Router>
    <Header />
    <br/>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/feed" element={<Feed />} />
      {/* Adicione outras rotas conforme necessário */}
    </Routes>
    <br/>
    <Footer />
  </Router>
);

export default App;
