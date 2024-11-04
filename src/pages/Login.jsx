// src/Login.js
import React, { useState} from 'react';
import { useAuth } from '../context/authContext'; // Importa o hook useAuth
import {fetchConnect} from '../utils/fetch';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  document.title="Login"
  const navigate = useNavigate()
  const { login } = useAuth(); // Usa o contexto de autenticação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Impede o recarregamento da página
      try {
        let result = await fetchConnect('auth/l-fdback', 'POST', { email, password })
        if(!result.status)
          throw new Error(result.result);
        login(`Bearer ${result.result}`) // Envia as credenciais
        if (!login) {
          throw new Error('Falha no login');
        }
        navigate('/feed')
        // Aqui você pode redirecionar para outra página ou fazer outra ação
      } catch (error) {
        setError(error.message);
      }
    };
    
    return (
      <div className="container mx-10 d-flex justify-content-center align-items-center vh-30" style={{height:'100%'}}>
        <form className="col-md-6 p-10" onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Login</h2>
      
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Usuário:</label>
            <input
              type="text"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
      
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
      
          <button type="submit" className="btn btn-primary w-100">Login</button><br/><br/>
      
          {error && <p className="text-danger mt-3">{error}</p>}

          <a href="/register" className="btn border w-20">Registrar</a>
        </form>
      </div>
      
    );
};

export default Login;
