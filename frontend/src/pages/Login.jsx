// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/donors/login",
        formData
      );

      if (response.data && response.data.success) {
        const donorId =
          response.data.donorId ||
          (response.data.donor && response.data.donor._id);

        if (!donorId) {
          setError("Invalid response from server.");
          return;
        }

        // ✅ Save donorId
        localStorage.setItem("donorId", donorId);

        // ✅ Notify navbar to update (same-tab event)
        window.dispatchEvent(new Event("donorLogin"));

        // ✅ Redirect to dashboard route
        navigate(`/donor/${donorId}`);
      } else {
        setError(response.data?.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Server error. Please try again later."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Donor Login</h2>
          <p>Login to access your donor dashboard</p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-link">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
