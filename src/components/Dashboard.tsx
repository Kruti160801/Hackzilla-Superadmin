import React, { useState, useEffect } from "react";
import foodDeliveryBg from "../images/Food-delivery-bg.jpg";
import { supabase } from "../supabaseClient"; // <-- import supabase client

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
    // signup fields
    name: "",
    confirmPassword: "",
  });

  const openModal = (type: "login" | "signup") => {
    setMode(type);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setMode("login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (mode === "login") {
      if (!formData.email || !formData.password) {
        setErrorMsg("Please fill in all required fields");
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setErrorMsg("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          setErrorMsg(error.message);
        } else {
          alert(`Welcome back! Login successful for: ${formData.email}`);
          closeModal();
          setFormData({
            email: "",
            password: "",
            remember: false,
            name: "",
            confirmPassword: "",
          });
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name }
          }
        });
        if (error) {
          setErrorMsg(error.message);
        } else {
          alert(`Sign up successful for: ${formData.email}. Please check your email to confirm your account.`);
          closeModal();
          setFormData({
            email: "",
            password: "",
            remember: false,
            name: "",
            confirmPassword: "",
          });
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    openModal("signup");
  };

  const handleSwitchToSignup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMode("signup");
  };

  const handleSwitchToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMode("login");
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("Password reset functionality would be implemented here!");
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          height: 100vh;
          overflow: hidden;
        }

        .background-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .background-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 40px;
          background: transparent;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
          background: linear-gradient(45deg, #fff, #f39c12);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-buttons {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .header-btn {
          padding: 12px 24px;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
          letter-spacing: 0.5px;
          min-width: 100px;
        }

        .header-login-btn {
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        .header-login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }

        .header-signup-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          backdrop-filter: blur(10px);
        }

        .header-signup-btn:hover {
          background: white;
          color: #333;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,255,255,0.3);
        }

        .main-content {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          flex-direction: column;
          text-align: center;
          position: relative;
          z-index: 2;
          padding-top: 80px;
        }

        .content-wrapper {
          max-width: 800px;
          padding: 0 20px;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }

        .main-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
        }

        .main-subtitle {
          font-size: 1.4rem;
          margin-bottom: 2rem;
          opacity: 0.95;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
          line-height: 1.6;
        }

        .main-description {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: ${isModalOpen ? "flex" : "none"};
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          transform: scale(0.9);
          animation: modalSlideIn 0.3s ease forwards;
          position: relative;
        }

        @keyframes modalSlideIn {
          to {
            transform: scale(1);
          }
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #999;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
          text-align: center;
          background: linear-gradient(45deg, #e74c3c, #f39c12);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e1e8ed;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafbfc;
        }

        .form-input:focus {
          outline: none;
          border-color: #e74c3c;
          background: white;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          font-size: 0.9rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-container input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #e74c3c;
        }

        .forgot-link {
          color: #e74c3c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #c0392b;
          text-decoration: underline;
        }

        .modal-btn {
          width: 100%;
          padding: 15px;
          background: ${
            isLoading
              ? "linear-gradient(45deg, #45a049, #66bb6a)"
              : "linear-gradient(45deg, #e74c3c, #c0392b)"
          };
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }

        .modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
        }

        .switch-text {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        .switch-link {
          color: #e74c3c;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .switch-link:hover {
          color: #c0392b;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .header {
            padding: 15px 20px;
          }
          
          .logo {
            font-size: 1.5rem;
          }
          
          .header-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
            min-width: 80px;
          }
          
          .main-title {
            font-size: 2.5rem;
          }
          
          .main-subtitle {
            font-size: 1.1rem;
          }
          
          .main-description {
            font-size: 1rem;
          }
          
          .modal-content {
            padding: 30px 20px;
            margin: 20px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="logo">FoodHub</div>
        <div className="header-buttons">
          <button
            className="header-btn header-signup-btn"
            onClick={handleSignupClick}
          >
            Sign Up
          </button>
          <button className="header-btn header-login-btn" onClick={() => openModal("login")}>
            Login
          </button>
        </div>
      </header>

      {/* Background with overlay */}
      <div className="background-container">
        <img
          src={foodDeliveryBg}
          alt="Food delivery background"
          className="background-image"
        />
        <div className="background-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="main-title">Welcome to FoodHub</h1>
          <p className="main-subtitle">
            Your favorite meals, delivered fresh & fast
          </p>
          <p className="main-description">
            Discover delicious food from top restaurants in your area. Order now
            and get it delivered hot to your doorstep.
          </p>
        </div>
      </div>

      {/* Modal for Login/Signup */}
      <div
        className="modal"
        onClick={(e) => {
          if (
            e.target instanceof HTMLElement &&
            e.target.classList.contains("modal")
          ) {
            closeModal();
          }
        }}
      >
        <div className="modal-content">
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
          {mode === "login" ? (
            <>
              <h2 className="modal-title">Welcome Back</h2>
              <p className="modal-subtitle">Please sign in to your account</p>
              <div>
                {errorMsg && (
                  <div style={{ color: "#e74c3c", marginBottom: 16, textAlign: "center" }}>
                    {errorMsg}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-options">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a
                    href="#"
                    className="forgot-link"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  onClick={handleSubmit}
                  className="modal-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
                <div className="switch-text">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="switch-link"
                    onClick={handleSwitchToSignup}
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="modal-title">Create Account</h2>
              <p className="modal-subtitle">Sign up to get started</p>
              <div>
                {errorMsg && (
                  <div style={{ color: "#e74c3c", marginBottom: 16, textAlign: "center" }}>
                    {errorMsg}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="modal-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
                <div className="switch-text">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="switch-link"
                    onClick={handleSwitchToLogin}
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
