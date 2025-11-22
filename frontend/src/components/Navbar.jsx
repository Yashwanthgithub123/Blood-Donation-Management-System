// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { FaTint, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDonorMenu, setShowDonorMenu] = useState(false);
  const [donorId, setDonorId] = useState(localStorage.getItem("donorId"));
  const navigate = useNavigate();
  const donorRef = useRef();

  useEffect(() => {
    const onLogin = () => setDonorId(localStorage.getItem("donorId"));
    const onLogout = () => setDonorId(null);

    window.addEventListener("donorLogin", onLogin);
    window.addEventListener("donorLogout", onLogout);
    window.addEventListener("storage", onLogin); // cross-tab

    return () => {
      window.removeEventListener("donorLogin", onLogin);
      window.removeEventListener("donorLogout", onLogout);
      window.removeEventListener("storage", onLogin);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (donorRef.current && !donorRef.current.contains(e.target)) {
        setShowDonorMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDonorMenu = (e) => {
    e.stopPropagation();
    setShowDonorMenu((p) => !p);
  };

  const handleLogout = () => {
    localStorage.removeItem("donorId");
    setDonorId(null);
    window.dispatchEvent(new Event("donorLogout"));
    navigate("/login");
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setShowDonorMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <FaTint className="logo-icon" />
        <span className="logo-text"><span className="red">Blood</span><span className="black">Link</span></span>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen((p) => !p)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" className="nav-item" onClick={closeMenus}>Home</NavLink>

        <div className="nav-item donor-dropdown" ref={donorRef}>
          <div onClick={toggleDonorMenu} className="donor-trigger">Donor ▾</div>

          <div className={`dropdown-menu ${showDonorMenu ? "show" : ""}`}>
            {!donorId ? (
              <>
                <NavLink to="/register" className="dropdown-item" onClick={closeMenus}>Register</NavLink>
                <NavLink to="/login" className="dropdown-item" onClick={closeMenus}>Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to={`/donor/${donorId}`} className="dropdown-item" onClick={closeMenus}>Dashboard</NavLink>
                <button className="dropdown-item" onClick={() => { handleLogout(); closeMenus(); }}>Logout</button>
              </>
            )}
          </div>
        </div>

        <NavLink to="/find-donors" className="nav-item" onClick={closeMenus}>Search Donors</NavLink>
        <NavLink to="/about" className="nav-item" onClick={closeMenus}>About Us</NavLink>
        <NavLink to="/contact" className="nav-item" onClick={closeMenus}>Contact</NavLink>
        <NavLink to="/admin-login" className="nav-item" onClick={closeMenus}>Admin</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
