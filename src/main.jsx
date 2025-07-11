// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import ThemeProvider from "./components/ThemeProvider";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './supabase';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabase}>
         <ThemeProvider>
        <App />
        </ThemeProvider>
      </SessionContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
