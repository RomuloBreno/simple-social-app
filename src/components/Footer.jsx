
// src/components/Footer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { factoryUser } from '../utils/fetch';
const Footer = () => {
  const [IsLoged, setIsLoged] = useState()
  const data = useAuth().data

  useEffect(() => {
    if (!data?.user) {
      setIsLoged(false); // Usuário não autenticado
      return
    } else {
      setIsLoged(true); // Usuário autenticado
    }



  }, [data?.user]);

  return (
    <footer style={{bottom:'0px',position: 'relative', width:' 100%',backgroundColor: '#333', color: '#fff', padding: '10px', textAlign: 'center' }}>
      <br />
      <div className='container'>
      <nav style={{ width: '36%', alignSelf: 'center', fontSize: '0.8em', marginLeft: '8%', marginRight: '8%' }}>
        {
          !IsLoged &&
          <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'white' }}>Home</Link>
        }
        {
          IsLoged &&
          <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'white' }}>Feedbacks</Link>
        }
        <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'gray' }}>Publishes</Link>
        <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'gray' }}>Suporte</Link>
        <Link to="/login" style={{ padding: '8%', textDecoration: 'none', color: 'gray' }}>Login</Link>

      </nav>
      </div>
      <br />
      <br />
      <p>&copy; Soulsfix</p>
    </footer>
  )
};

export default Footer;
