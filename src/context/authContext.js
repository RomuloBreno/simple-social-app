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
  const [wsConnect, setWsConnect] = useState()
  const [imageProfile, setImageProfile] = useState()

  if(wsConnect){
    wsConnect.onopen = () => {
      console.log('Conexão WebSocket aberta');
    };
    wsConnect.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };
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
  try {
    const tokenToUse = token || tokenParam;
    const initCredentials = await initContext(tokenToUse);

    if (!initCredentials) throw new Error("Failed to initialize credentials.");

    const getImageProfile = `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/profile/${initCredentials?._id}/${initCredentials?._id}-${initCredentials?.pathImage}`;
    setImageProfile(getImageProfile);

    const wsUrl = `ws://${process.env.REACT_APP_URL_WS}?token=${tokenToUse}&userId=${initCredentials._id}`;
    let wsConnection;

    try {
      wsConnection = new WebSocket(wsUrl);
      
      // Suppress WebSocket errors from showing in the console
      wsConnection.onerror = () => {}; 

      wsConnection.onopen = () => {
        setWsConnect(wsConnection);
      };
  
    } catch {
      console.warn("WebSocket connection failed.");
    }

    setData({
      user: initCredentials,
      imageProfile: getImageProfile,
      token: tokenToUse,
      webSocket: wsConnection || wsConnect,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};



  // 4. Use useEffect para disparar a função assíncrona no início
  useEffect(() => {
    fetchData();
  }, [tokenInit]);

  return (
    <UserContext.Provider value={{ data, refetch: fetchData, add, remove, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext)
};

