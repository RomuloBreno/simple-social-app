// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { factoryUser, fetchApi } from '../utils/fetch';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [data, setData] = useState(null);
  const [userLogged, setUserLogged] = useState();
  const [wsConnection, setWsConnection] = useState(null);
  

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setUserLogged(true)
    setToken(newToken); // Corrigido: apenas a string
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setData(null);
    setUserLogged(false)
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
  };
  
  const validToken = async (token) => {
      let resultWithid = await fetchApi(`auth/t-fdback`, null, 'GET', null, token)
      return resultWithid
   };

  const factoryData = async (tokenToUse, user) => {
    if(!user)
      return false
    try {
      const imageProfile = `${process.env.REACT_APP_URL_S3}/temp/profile/${user._id}/${user._id}-${user.pathImage}`;
      setData({
        user,
        imageProfile,
        token: tokenToUse,
      });

      return user;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      logout(); // Token inválido ou erro de API → desloga
    }
  };
    
  const connectWs = (validTokenGetId,tokenToUse, userId) => {
    if (!tokenToUse || !userId || !validTokenGetId) return;

    const wsUrl = `${process.env.REACT_APP_URL_WS}?token=${tokenToUse}&userId=${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onerror = () => console.log("WebSocket connection error.");
    ws.onopen = () =>  setWsConnection(ws);

   
  };

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      const validTokenGetId = await validToken(token)
      const user =  await factoryUser(token, validTokenGetId);
      await factoryData(token, user)
      if (user) {
        connectWs(validTokenGetId,token, user._id);
      }
    };

    init();
  }, [token]);

  return (
    <UserContext.Provider value={{wsConnection, data, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
