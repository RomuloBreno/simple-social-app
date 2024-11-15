// src/Login.js
import React, { useState } from 'react';
import { fetchConnect } from '../utils/fetch';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';


const Register = () => {
  function hashPassword(name, nick, email, job, password) {
    return btoa(`${name}:${nick}:${email}:${job}:${password}`)
  }
  document.title = "Register"
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);


  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Captura o token de verificação
  };

  String.prototype.ValidEmail = function () {
    // A regex pattern for validating an email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this); // true para um email válido
  }
  const handleSubmit = async (e) => {
    const passwordHash = hashPassword(name, nick, email, job, password)
    e.preventDefault(); // Impede o recarregamento da página
    try {
      if (!email.ValidEmail())
        throw new Error('E-mail invalido, verifique e tente novamente');
      if (!captchaToken)
        throw new Error('Houve problemas no envio do recaptcha');
      if (password !== confirmPassword) {
        throw new Error('As senhas precisam ser iguais');
      }
      let result = await fetchConnect('auth/register', 'POST', { result: passwordHash })
      if (!result.status)
        throw new Error(result.result);
      //implement email verification
      navigate('/login')
      // Aqui você pode redirecionar para outra página ou fazer outra ação
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-10 d-flex justify-content-center align-items-center vh-30" style={{ height: '100%' }}>
      <form className="col-md-6 p-10" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Registrar-se</h2>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nome:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="nick" className="form-label">Nick:</label>
          <input
            type="text"
            id="nick"
            className="form-control"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="job" className="form-label">Nivel Profissional:</label>
          <input
            type="text"
            id="job"
            className="form-control"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-3">
          <label htmlFor="confirm password" className="form-label">Confirme a Senha:</label>
          <input
            type="password"
            id="confimrPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
        <br />
        {error && <p className="text-danger mt-3">{error}</p>}
        <br />
        <div className=''>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
            onChange={handleCaptchaChange}
          />
        </div>
        <br />
      </form>
    </div>

  );
};

export default Register;
