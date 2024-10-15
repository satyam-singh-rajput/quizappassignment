// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider
import { UserProvider } from './UserContext'; // Import UserProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </UserProvider>
);
