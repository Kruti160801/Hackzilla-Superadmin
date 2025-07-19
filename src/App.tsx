import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./components/Dashboard";
import RestaurantDashboard from "./components/RestaurantDashboard";
import AddMenu from "./components/AddMenu";
import RestaurantSetup from "./components/RestaurantSetup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
      <Route path="/restaurant/add-menu" element={<AddMenu />} />
      <Route path="/restaurant/setup" element={<RestaurantSetup />} />
    </Routes>
  );
}

export default App;
