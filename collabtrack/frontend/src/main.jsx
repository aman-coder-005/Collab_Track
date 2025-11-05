import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './Context/AuthContext';
import { ProjectProvider } from './Context/ProjectContext'; // 1. Import ProjectProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProjectProvider> {/* 2. Wrap the App */}
        <App />
      </ProjectProvider>
    </AuthProvider>
  </React.StrictMode>
);