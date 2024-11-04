// src/Context.js
import React, { createContext, useContext, useState } from 'react';
import { factoryUser } from '../utils/fetch';
// Criação do contexto de autenticação
const Context = createContext();

// Provedor de contexto
export const ProviderVars = ({ children }) => {
  const [user, setUser] = useState(async () => {
    // Tenta recuperar o token do localStorage na inicialização
    const userData = localStorage.getItem('userData');
    return userData ? {nick: userData.nick} : null;
  });
  const add = (userData) => {
    setUser({ userData });
    localStorage.setItem('userData', userData); // Armazena o token no localStorage
  };

  const remove = () => {
    setUser(null);
    localStorage.removeItem('userData'); // Remove o token do localStorage
  };
  return (
    <Context.Provider value={{ user }}>
      {children}
    </Context.Provider>
  );
};

// Hook para acessar o contexto
export const useContextVars = () => {
  return useContext(Context);
};
