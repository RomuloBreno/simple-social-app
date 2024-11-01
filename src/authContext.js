// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Provedor de contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Tenta recuperar o token do localStorage na inicialização
    const savedToken = localStorage.getItem('authToken');
    return savedToken ? { token: savedToken} : null;
  });

  const login = (token) => {
    setUser({ token });
    localStorage.setItem('authToken', token); // Armazena o token no localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken'); // Remove o token do localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
