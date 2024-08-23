import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from './providers';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </Router>
  </React.StrictMode>
);
