import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Donate Blood, Save Lives ❤️</h1>
        <p>
          Be the reason for someone's heartbeat. Join <strong>BloodLink</strong> and help those in need by becoming a donor today.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-donor">
            Become a Donor
          </Link>

          {/* ✅ Updated to connect to FindDonors.jsx */}
          <Link to="/find-donors" className="btn btn-find">
            Find Donors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
