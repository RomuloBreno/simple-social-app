
// src/components/Footer.tsx
import React, {useState, useEffect} from 'react';
import { useAuth } from '../context/authContext';
import { factoryUser } from '../utils/fetch';
const Footer = () => {
  const [IsLoged, setIsLoged] = useState(false)
  const user = useAuth()
  useEffect(() => {
    let response;
    const fetchUser = async () => {
        if (user?.token)
            response = await factoryUser(user?.token)
    }
    fetchUser();
    if (!user.token) {
        setIsLoged(false); // Usuário não autenticado
        return
    } else {
        setIsLoged(true); // Usuário autenticado
    }



}, [user?.token]);
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
          <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'gray' }}>Feedbacks</a>
        }
        <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'gray' }}>Publishes</a>
        <a href="/" style={{ margin: '0 30px', textDecoration: 'none',color: 'gray' }}>Suporte</a>
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
