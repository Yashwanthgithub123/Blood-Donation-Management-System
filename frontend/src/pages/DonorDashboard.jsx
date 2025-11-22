// src/pages/DonorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DonorDashboard.css";

const DonorDashboard = () => {
  const { donorId: routeId } = useParams();
  const storedId = localStorage.getItem("donorId");
  const donorId = routeId || storedId;

  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!donorId) {
      setError("No donorId found. Please login.");
      setLoading(false);
      return;
    }

    const fetchDonor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/donors/${donorId}`);
        if (res.data && res.data.success && res.data.donor) {
          setDonor(res.data.donor);
        } else {
          setError(res.data?.message || "Donor not found");
        }
      } catch (err) {
        console.error("Error fetching donor:", err);
        setError("Failed to fetch donor. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonor();
  }, [donorId]);

  const downloadQR = async () => {
    const qrArea = document.getElementById("qr-area");
    if (!qrArea) return;
    const canvas = await html2canvas(qrArea);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 30, 30, 150, 150);
    pdf.save("Donor_QR.pdf");
  };

  const handleLogout = () => {
    localStorage.removeItem("donorId");
    window.dispatchEvent(new Event("donorLogout"));
    navigate("/login");
  };

  if (loading) return <h2 className="loading">Loading Dashboard...</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!donor) return <h2 className="error">Donor not found</h2>;

  return (
    <div className="dashboard-container">
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="dashboard-title">Welcome, {donor.fullName} 👋</h1>

      <div className="dashboard-card">
        <h2>Your Donor QR Code</h2>
        <div id="qr-area" className="qr-box">
          <QRCodeSVG value={donor._id} size={180} />
          <p className="qr-id">Donor ID: {donor._id}</p>
        </div>
        <button className="download-btn" onClick={downloadQR}>Download QR Code</button>
      </div>

      <div className="info-card">
        <h3>Your Details</h3>
        <p><strong>Name:</strong> {donor.fullName || "N/A"}</p>
        <p><strong>Email:</strong> {donor.email || "N/A"}</p>
        <p><strong>Phone:</strong> {donor.phone || "N/A"}</p>
        <p><strong>Blood Group:</strong> {donor.bloodGroup || "N/A"}</p>
        <p><strong>City:</strong> {donor.city || "N/A"}</p>
        <p><strong>District:</strong> {donor.district || "N/A"}</p>
      </div>
    </div>
  );
};

export default DonorDashboard;
