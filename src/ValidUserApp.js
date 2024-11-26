// src/App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from "./context/authContext";
import App from './App';



const ValidUserApp = () => {
  const { data } = useAuth();
  const user = data?.user

  useEffect(() => {
    // Poderia ser usado para configurar algo ao carregar o usuário
    console.log("Usuário atualizado:", user);
  }, [user]);

  return (
  <>
    {!user ? (
      <p>Carregando...</p>
    ) : (
        <App userLoged={user}/>
    )}
  </>
  )

};
export default ValidUserApp;
