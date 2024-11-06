// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { factoryUser } from '../utils/fetch';
import { s } from '../utils/fetch';
// Criação do contexto de autenticação

async function initContext(tokenParam){
  return tokenParam ? await factoryUser(tokenParam) : null; 
}



const UserContext = createContext();

const tokenInit = localStorage.getItem('authToken');

export const UserProvider = ({ children }) => {
  const [data, setData] = useState(null);   // Armazena os dados
  const [token, setToken] = useState(tokenInit);   // Armazena os dados

  const fetchData = async () => {
  const initCredencials = await initContext(token);
  setData({ user: initCredencials ? initCredencials: null, token: tokenInit }) // Atualiza o estado com os dados recebidos
  };

  const add = (getUser) => {
    setData({ getUser }); // Armazena
  };

  const remove = () => {
    setData(null); // Remove
  };

  const login = (token) => {
    setToken({token })
    localStorage.setItem('authToken', token); // Armazena o token no localStorage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken'); // Remove o token do localStorage
  };

  // 4. Use useEffect para disparar a função assíncrona no início
  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <UserContext.Provider value={{ data, refetch: fetchData, add, remove, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext)
};

