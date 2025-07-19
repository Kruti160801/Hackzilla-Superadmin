import React, { type ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./components/Auth/SignIn";
import Login from "./components/Auth/Login";
import { AuthProvider, useAuth } from "./AuthProvider";
import Dashboard from "./components/Dashboard";

function Home() {
  return <Dashboard />;
}

const RequireAuth: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
