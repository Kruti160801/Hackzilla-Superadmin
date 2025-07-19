import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
