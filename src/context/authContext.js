// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { factoryUser } from '../utils/fetch';
import { s } from '../utils/fetch';
// Criação do contexto de autenticação

async function initContext(tokenParam) {
  return tokenParam ? await factoryUser(tokenParam) : null;
}

const UserContext = createContext();

const tokenInit = localStorage.getItem('authToken');

export const UserProvider = ({ children }) => {
  const [data, setData] = useState(null);   // Armazena os dados
  const [token, setToken] = useState(tokenInit);   // Armazena os dados
  const [wsConnection, setWsConnection] = useState(null)
  const [imageProfile, setImageProfile] = useState()

  if (wsConnection) {
    wsConnection.onerror = () => { console.log("WebSocket connection error."); };
    wsConnection.onopen = () => { console.log("WebSocket connection success."); };
  }

  const add = (token) => {
    fetchData(token) // Armazena
  };

  const remove = () => {
    setData(null); // Remove
  };

  const login = (token) => {
    setToken({ token })
    localStorage.setItem('authToken', token); // Armazena o token no localStorage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken'); // Remove o token do localStorage
  };

  const fetchData = async (tokenParam) => {
    const tokenToUse = token || tokenParam;
    const initCredentials = await getCredentials(tokenToUse)

    const getImageProfile = `${process.env.REACT_APP_URL_S3}/temp/profile/${initCredentials?._id}/${initCredentials?._id}-${initCredentials?.pathImage}`;
    setImageProfile(getImageProfile);

    setData({
      user: initCredentials,
      imageProfile: getImageProfile,
      token: tokenToUse,
      webSocket: wsConnection
    });
  };

  const getCredentials = async (tokenToUse) => {
    const initCredentials = await initContext(tokenToUse);
    if (!initCredentials) throw new Error("Failed to initialize credentials.");
    return initCredentials
  }

  const connectWs = async ()=>{
    const initCredentials = await getCredentials(token)
    const wsUrl = `${process.env.REACT_APP_URL_WS}?token=${token}&userId=${initCredentials?._id}`;
    setWsConnection(new WebSocket(wsUrl));
  }

  // 4. Use useEffect para disparar a função assíncrona no início
  useEffect(() => {
    fetchData();
  }, [tokenInit]);

   useEffect(() => {
    connectWs();
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

