import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [messageCount, setMessageCount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);

  const handleLogout = () => {
    navigate("/admin-login");
  };

  const handleViewDonors = () => navigate("/admin-donors");
  const handleManageRequests = () => navigate("/admin-requests");
  const handleContactMessages = () => navigate("/admin-messages");

  const fetchCounts = async () => {
    try {
      const messagesRes = await axios.get("http://localhost:5000/api/contacts");
      setMessageCount(messagesRes.data.length);

      const donorsRes = await axios.get("http://localhost:5000/api/donors");
      setDonorCount(donorsRes.data.length);
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-card">
        <h1>Welcome, Admin 👩‍💻</h1>
        <p>Manage your system here efficiently.</p>

        <div className="dashboard-actions">
          <button onClick={handleViewDonors}>
            View Donors {donorCount > 0 && <span className="count-badge">{donorCount}</span>}
          </button>
          <button onClick={handleManageRequests}>Manage Requests</button>
          <button onClick={handleContactMessages}>
            Contact Messages {messageCount > 0 && <span className="count-badge">{messageCount}</span>}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
