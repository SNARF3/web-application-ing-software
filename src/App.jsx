import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UCBHome from './components/UCBHome.jsx';
import AdminHome from './components/AdminHome.jsx';
import Home from './components/Home.jsx';
import ColaboradorHome from './components/ColaboradorHome.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<UCBHome />} />
        <Route path="/UCB-Explorer-Manager" element={<Home />} />
        
        {/* Rutas protegidas por autenticación */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/colaborador" 
          element={
            <ProtectedRoute requiredRole="Colaborador">
              <ColaboradorHome />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<UCBHome />} />
      </Routes>
    </Router>
  );
};

export default App;