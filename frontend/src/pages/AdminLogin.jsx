import React, { useState } from "react";
import "../styles/AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === "1234") {
      navigate("/admin-dashboard");
    } else {
      setError("Incorrect Password! Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <FaLock className="lock-icon" />
        <h2>Admin Access</h2>
        <p>Enter your 4-digit security code to continue.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            maxLength="4"
            placeholder="••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
