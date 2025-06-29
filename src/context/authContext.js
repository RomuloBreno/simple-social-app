// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { factoryUser } from '../utils/fetch';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [data, setData] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken); // Corrigido: apenas a string
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setData(null);
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
  };

  const fetchData = async (tokenToUse) => {
    if (!tokenToUse) return;

    try {
      const user = await factoryUser(tokenToUse);
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

  const connectWs = (tokenToUse, userId) => {
    if (!tokenToUse || !userId) return;

    const wsUrl = `${process.env.REACT_APP_URL_WS}?token=${tokenToUse}&userId=${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onerror = () => console.log("WebSocket connection error.");
    ws.onopen = () => console.log("WebSocket connection success.");

    setWsConnection(ws);
  };

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      const user = await fetchData(token);
      if (user) {
        connectWs(token, user._id);
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
