// src/Login.js
import React, { useState } from 'react';
import { Link} from "react-router-dom";
import { useAuth } from '../context/authContext'; // Importa o hook useAuth
import { fetchConnect } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';


const Login = () => {
  // Função para hash de senha
  function hashPassword(email, password) {
    return btoa(`${email}:${password}`)
  }
  
  document.title = "Login"
  const navigate = useNavigate()
  const [captchaToken, setCaptchaToken] = useState(null);
  const { login, add, remove } = useAuth(); // Usa o contexto de autenticação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para gerenciar o carregamento


  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Captura o token de verificação
  };


  String.prototype.ValidEmail = function () {
    // A regex pattern for validating an email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this); // true para um email válido
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    const passUserHash = hashPassword(email,password)
    try {
      if (!email.ValidEmail())
        throw new Error('E-mail invalido, verifique e tente novamente');
        if (!captchaToken)
          throw new Error('Erro: falta ou problemas no envio do recaptcha');
        setLoading(true)
        let result = await fetchConnect('auth/l-fdback', 'POST', { result: passUserHash, rcapt:captchaToken })
        if (!result.status){
          setLoading(false)
          throw new Error(result.result);
        }
        login(`Bearer ${result.result}`) 
        add(`Bearer ${result.result}`)// Envia as credenciais
      window.location.href = "/feed"
      // Aqui você pode redirecionar para outra página ou fazer outra ação
      setCaptchaToken(null)
      setLoading(false)
    } catch (error) {
      
      setError(error.message);
      setLoading(false)
    }
  };

  return (
    <div className="container mx-10 d-flex justify-content-center align-items-center vh-30" style={{ height: '100%' }}>
    
     {loading ? (
      <div style={{ textAlign: 'center',marginTop: '2%', width: '100%',height: '100%',zIndex: '12',position: 'absolute',alignContent: 'center', background: '#808080ad' }}>
        <div className="container spinner-border p-10"role="status" >
          <span className="sr-only"></span>
        </div>
      </div>
      ):(
        <div>

        </div>
      )}

        
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
          maxLength={70}
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
          maxLength={70}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">Login</button>

      <br />
      {error && <p className="text-danger mt-3">{error}</p>}
      <br />
    <ReCAPTCHA
      sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
      onChange={handleCaptchaChange}
    />
    <br />
      <Link to="/register" className="btn border w-20">Registrar</Link>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
        <br />
        <br />
        <br />
        <br />
        <br />

    </form>
    </div>

  );
};

export default Login;
