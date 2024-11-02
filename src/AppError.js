// src/App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import IndexError from './pages/HomeError';


const App = () => {
  return (
    <Router>
        <Header />
      <br />
        <Routes>
        <Route path="/" element={<IndexError />} />
        </Routes>
      <br />
        <Footer />
    </Router>
  )

};
export default App;
