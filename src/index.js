import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppError from './AppError';
import reportWebVitals from './reportWebVitals';
import {UserProvider } from './context/authContext.js';
import {api} from './utils/api.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
// const connectApi = await api()
const connectApi = true
root.render(
  // <React.StrictMode>
         
          <UserProvider>
            
            {connectApi
            ?<App/>
            : <AppError />
            }
          </UserProvider>
   
  // </React.StrictMode>
);

reportWebVitals();
