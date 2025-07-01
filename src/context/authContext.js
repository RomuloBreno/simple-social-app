// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { factoryUser, fetchApi } from '../utils/fetch';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [data, setData] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);
  const [validSavedToken, setValidSavedToken] = useState(null);
  const [user, setUser] = useState(null);

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

  const validToken = async (token) => {
    let resultWithid = await fetchApi(`auth/t-fdback`, null, 'GET', null, token)
    return resultWithid
  };

  const factoryData = async (tokenToUse, user) => {
    if (!user)
      return false
    try {
      const imageProfile = `${process.env.REACT_APP_URL_S3}/temp/profile/${user._id}/${user._id}-${user.pathImage}`;
      setData({
        user,
        imageProfile,
        token: tokenToUse,
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      logout(); // Token inválido ou erro de API → desloga
    }
  };

  const connectWs = (validTokenGetId, tokenToUse, userId) => {
    if (!tokenToUse || !userId || !validTokenGetId.status || wsConnection) return;

    const wsUrl = `${process.env.REACT_APP_URL_WS}?token=${tokenToUse}&userId=${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onerror = () => setWsConnection(false);
    ws.onopen = () => setWsConnection(ws);


  };

  const connectionWebSocket = async (user) => {
    if (user && validSavedToken.status || false) {
      connectWs(validSavedToken, token, user._id);
    }
  };

  const validTokenToLogout = () => {
    if (validSavedToken?.status == false) {
      logout()
    }
  };

  const factoryDataToLoggon = async () => {
    await factoryData(token, user);
  };

  const IstokenValid = async () => {
    setValidSavedToken(await validToken(token));
  };

  const setFactoryUser = async () => {
    setUser(await factoryUser(token, validSavedToken));
  };

  const RoleToAcess = () => {
    if (validSavedToken?.status == true) {
      setFactoryUser()
    } else {
      validTokenToLogout()
    }
  };

  const RoleToPermission = () => {
    if (validSavedToken?.status && user) {
      connectionWebSocket(user);
      factoryDataToLoggon();
    }
  };

  useEffect(() => {
    IstokenValid();
  }, [token]);

  useEffect(() => {
    RoleToAcess()
  }, [validSavedToken]);

  useEffect(() => {
    RoleToPermission()
  }, [user]);


  return (
    <UserContext.Provider value={{ wsConnection, data, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
