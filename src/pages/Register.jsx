// src/Login.js
import React, { useState} from 'react';
import {fetchConnect} from '../utils/fetch';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    document.title="Register"
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [job, setJob] = useState('');
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        try {
            if(password !== confirmPassword){
              throw new Error('As senhas precisam ser iguais');
            }
            let result = await fetchConnect('auth/register', 'POST', {name, nick, email,job, password})
            if(!result.status)
                throw new Error(result.result);
            //implement email verification
            navigate('/login')
            // Aqui você pode redirecionar para outra página ou fazer outra ação
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container mx-10 d-flex justify-content-center align-items-center vh-30" style={{height:'100%'}}>
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
      
          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
      </div>
      
    );
};

export default Register;
