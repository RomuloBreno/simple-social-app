// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { factoryUser } from '../utils/fetch';
import { s } from '../utils/fetch';
// Criação do contexto de autenticação
const AuthContext = createContext();

// Provedor de contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Tenta recuperar o token do localStorage na inicialização
    const savedToken = localStorage.getItem('authToken');
    return savedToken ? { token: savedToken } : null;
  });

  const login = (token) => {
    setToken({ token });
    localStorage.setItem('authToken', token); // Armazena o token no localStorage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken'); // Remove o token do localStorage
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};



// const UserContext = createContext();



// // Provedor de contexto
// export const UserProvider = ({ children, token }) => {
//   const [user, setUser] = useState(async () => {
//     const getUser = await factoryUser(token)
//     return getUser ? { userData: getUser} : null;
//   });

//   const add = async (token) => {
//     const getUser = await factoryUser(token)
//     setUser({ getUser }); // Armazena
//   };

//   const remove = () => {
//     setUser(null); // Remove
//   };

//   return (
//     <UserContext.Provider value={{ user, add, remove }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Hook para acessar o contexto
// export const useUser = async () => {
//   return useContext(UserContext);
// };



// 1. Crie o contexto


// const UserContext = createContext();

// export const UserProvider = ({ children, token }) => {
//   const [data, setData] = useState(null);   // Armazena os dados

//   const fetchData = async () => {
//     const response = await factoryUser(token);  // Exemplo de chamada de API
//     setData({ user: response }) // Atualiza o estado com os dados recebidos

//   };

//   const add = (getUser) => {
//     setData({ getUser }); // Armazena
//   };

//   const remove = () => {
//     setData(null); // Remove
//   };
//   // 4. Use useEffect para disparar a função assíncrona no início
//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <UserContext.Provider value={{ data, refetch: fetchData, add, remove }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   return useContext(UserContext)
// };

