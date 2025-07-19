import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

const SignIn: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err: any) {
      // Enhanced error logging
      console.error("Sign Up Error:", {
        message: err.message,
        code: err.code,
        email: email,
        fullName: fullName,
        timestamp: new Date().toISOString(),
        stack: err.stack,
      });

      // Set user-friendly error message
      let errorMessage = "Failed to sign up";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email already registered. Please login instead.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Use at least 6 characters.";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email/password accounts are not enabled. Please contact support.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
