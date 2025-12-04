// App bootstrap: mounts Home page and global styles
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/Home.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);