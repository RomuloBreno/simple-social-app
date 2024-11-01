// src/pages/Index.tsx
import React from 'react';
import {useNavigate} from 'react-router-dom';

const Index = () => {
   document.title="Home"
  const navigate = useNavigate()


const Register = (e) =>{
  e.preventDefault(); // Impede o recarregamento da página
  navigate('/register')
}
  return(
  <main style={{ textAlign: 'center', padding: '20px', height:'900px' }}>
    <h1>Bem-vindo ao Projeto</h1>
    <p>Este é um projeto de rede social simples para compartilhar ideias e interagir.</p>
    <button onClick={Register} style={{ padding: '10px 20px', fontSize: '16px' }}>Inscrever-se</button>
  </main>

  )
};

export default Index;
