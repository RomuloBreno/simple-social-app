
// src/components/Footer.tsx
import React, {useState, useEffect} from 'react';
import { useAuth } from '../authContext';
const Footer = () => {
  const [IsLoged, setIsLoged] = useState(false)
  const user = useAuth()
  useEffect(() => {
    if (!user.user) {
      console.error('Acesso negado: usuário não autenticado');
      setIsLoged(false); // Usuário não autenticado
    } else {
      setIsLoged(true); // Usuário autenticado
    }
  }, [user]);
  return (
    <footer style={{ backgroundColor: '#333', color: '#fff', padding: '10px', textAlign: 'center' }}>
      <br/>
      <nav style={{ alignSelf: 'center', marginLeft: '8%', marginRight: '8%' }}>
        {
          !IsLoged &&
          <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Home</a>
        }
        {
          IsLoged &&
          <a href="/feed" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Feed</a> &&
          <a style={{ margin: '0 30px', textDecoration: 'none', color: 'white', color: 'gray' }}>Feedbacks</a>
        }
        <a style={{ margin: '0 30px', textDecoration: 'none', color: 'white', color: 'gray' }}>Publishes</a>
        <a style={{ margin: '0 30px', textDecoration: 'none', color: 'white', color: 'gray' }}>Suporte</a>
        {
          !IsLoged &&
          <a href="/login" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Login</a>
        }
      </nav>
      <br/>
      <br/>
      <p>&copy; Soulsfix</p>
    </footer>
  )
};

export default Footer;
