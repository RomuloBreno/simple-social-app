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
    wsConnect.close();
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
    const initCredencials = await initContext(token ? token : tokenParam);
    let getImageProfile = `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/profile/${initCredencials?._id}/${initCredencials?._id}-${initCredencials?.pathImage}`
    let wsConnection
    try {
      if(initCredencials)
        wsConnection = new WebSocket(`ws://${process.env.REACT_APP_URL_WS}?token=${tokenInit ? tokenInit : token}&userId=${initCredencials?._id}`)
      
    } catch (error) {
      console.log("Erro in connection")
    }
    console.log(wsConnection)
    setWsConnect(wsConnection)
    setImageProfile(getImageProfile)
    setData({ user: initCredencials ? initCredencials : null, imageProfile: imageProfile ? imageProfile : getImageProfile, token: tokenInit ? tokenInit : tokenParam, webSocket: wsConnection ? wsConnection : wsConnect}) // Atualiza o estado com os dados recebidos
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

