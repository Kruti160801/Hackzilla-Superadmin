import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./components/Dashboard";
import RestaurantDashboard from "./components/RestaurantDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
    </Routes>
  );
}

export default App;
