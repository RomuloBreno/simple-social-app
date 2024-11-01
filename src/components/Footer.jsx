
// src/components/Footer.tsx
import React from 'react';

const Footer= () => (
  <footer style={{ backgroundColor: '#333', color: '#fff', padding: '10px', textAlign: 'center'}}>
    <nav>
      <a href="/feed" style={{ margin: '0 10px', textDecoration:'none', color:'white' }}>Feed</a>
      <a href="/feedbacks" style={{ margin: '0 10px', textDecoration:'none', color:'white' }}>Feedbacks</a>
      <a href="/publishes" style={{ margin: '0 10px', textDecoration:'none', color:'white' }}>Publishes</a>
      <a href="/support" style={{ margin: '0 10px', textDecoration:'none', color:'white' }}>Suporte</a>
    </nav>
    <p>&copy; Soulsfix</p>
  </footer>
);

export default Footer;
