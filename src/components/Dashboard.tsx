import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import foodDeliveryBg from "../images/Food-delivery-bg.jpg";
import { supabase } from "../supabaseClient"; // import supabase client

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    document.body.style.overflow = "auto";
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setSignupError(null);
    document.body.style.overflow = "hidden";
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
    setSignupError(null);
    document.body.style.overflow = "auto";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    closeModal();
    setFormData({ email: "", password: "", remember: false });
    navigate("/restaurant/dashboard");
  };

  const handleSignup = async () => {
    setSignupError(null);
    if (!signupData.email || !signupData.password || !signupData.confirmPassword) {
      setSignupError("Please fill in all required fields");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
    });
    if (error) {
      setIsLoading(false);
      setSignupError(error.message);
      return;
    }

    // Insert user profile into users table
    if (data.user) {
      // You can add more fields as needed
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email: data.user.email }]);
      if (insertError) {
        setIsLoading(false);
        setSignupError("Signup succeeded, but failed to create user profile.");
        return;
      }
    }

    setIsLoading(false);
    closeSignupModal();
    setSignupData({ email: "", password: "", confirmPassword: "" });
    navigate("/restaurant/dashboard", { state: { fromSignup: true } });
  };

  const handleSignupClick = () => {
    openSignupModal();
  };

  const handleSwitchToSignup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeModal();
    openSignupModal();
  };

  const handleSwitchToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeSignupModal();
    openModal();
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert("Password reset functionality would be implemented here!");
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isModalOpen) closeModal();
        if (isSignupModalOpen) closeSignupModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isModalOpen, isSignupModalOpen]);

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

        .error-message {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 16px;
          font-size: 0.98rem;
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
          <button className="header-btn header-login-btn" onClick={openModal}>
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

      {/* Login Modal */}
      <div
        className="modal"
        style={{ display: isModalOpen ? "flex" : "none" }}
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
          <h2 className="modal-title">Welcome Back</h2>
          <p className="modal-subtitle">Please sign in to your account</p>
          {error && <div className="error-message">{error}</div>}
          <div>
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
        </div>
      </div>

      {/* Signup Modal */}
      <div
        className="modal"
        style={{ display: isSignupModalOpen ? "flex" : "none" }}
        onClick={(e) => {
          if (
            e.target instanceof HTMLElement &&
            e.target.classList.contains("modal")
          ) {
            closeSignupModal();
          }
        }}
      >
        <div className="modal-content">
          <button className="close-btn" onClick={closeSignupModal}>
            &times;
          </button>
          <h2 className="modal-title">Create Account</h2>
          <p className="modal-subtitle">Sign up to get started</p>
          {signupError && <div className="error-message">{signupError}</div>}
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email Address
              </label>
              <input
                type="email"
                id="signup-email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={signupData.email}
                onChange={handleSignupInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Password
              </label>
              <input
                type="password"
                id="signup-password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={signupData.password}
                onChange={handleSignupInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="signup-confirm-password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={handleSignupInputChange}
                required
              />
            </div>

            <button
              onClick={handleSignup}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
