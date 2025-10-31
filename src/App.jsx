import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UCBHome from './components/UCBHome.jsx';
import AdminHome from './components/AdminHome.jsx';
import ColaboradorHome from './components/ColaboradorHome.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UCBHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/colaborador" element={<ColaboradorHome />} />
      </Routes>
    </Router>
  );
};

export default App;
