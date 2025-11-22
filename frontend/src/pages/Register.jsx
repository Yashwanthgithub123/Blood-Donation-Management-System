// src/pages/Register.jsx
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/Register.css";
import { FaTint } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    bloodGroup: "",
    phone: "",
    city: "",
    district: "",
    lastDonationDate: "",
    latitude: "",
    longitude: "",
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [donorId, setDonorId] = useState("");
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Location picker component (uses hook inside)
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((p) => ({ ...p, latitude: lat, longitude: lng }));
      },
    });
    return markerPosition ? <Marker position={markerPosition} /> : null;
  };

  const downloadPDF = async (id) => {
    const qrElement = document.getElementById("qr-code");
    if (!qrElement) return;
    const canvas = await html2canvas(qrElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.text("BloodLink Donor QR Code", 60, 20);
    pdf.addImage(imgData, "PNG", 55, 30, 100, 100);
    pdf.text(`Donor ID: ${id}`, 75, 140);
    pdf.save(`Donor_${id}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      return alert("⚠ Please select your location on the map.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/donors/register", formData);

      if (!res.data || !res.data.donorId) {
        alert("❌ Registration failed! Try again.");
        return;
      }

      const id = res.data.donorId;
      localStorage.setItem("donorId", id);
      window.dispatchEvent(new Event("donorLogin")); // notify navbar

      setDonorId(id);
      setShowQR(true);

      alert("✅ Registration Successful!");

      // generate and download PDF of QR
      await downloadPDF(id);
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error);
      alert(error.response?.data?.message || "❌ Registration failed! Please check details.");
    }
  };

  const handleCloseQR = () => {
    setShowQR(false);
    // go to donor dashboard route (consistent)
    if (donorId) navigate(`/donor/${donorId}`);
    else navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <FaTint className="blood-icon" />
        <h2>Donor Registration</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <input value={formData.fullName} name="fullName" type="text" placeholder="Full Name" required onChange={handleChange} />
            <input value={formData.username} name="username" type="text" placeholder="Username" required onChange={handleChange} />
          </div>

          <div className="form-row">
            <input value={formData.email} name="email" type="email" placeholder="Email" required onChange={handleChange} />
            <input value={formData.password} name="password" type="password" placeholder="Password" required onChange={handleChange} />
          </div>

          <div className="form-row">
            <select name="bloodGroup" value={formData.bloodGroup} required onChange={handleChange}>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <input value={formData.phone} name="phone" type="text" placeholder="Phone" required onChange={handleChange} />
          </div>

          <div className="form-row">
            <input value={formData.city} name="city" type="text" placeholder="City" required onChange={handleChange} />
            <input value={formData.district} name="district" type="text" placeholder="District" required onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Last Donation Date</label>
            <input value={formData.lastDonationDate} name="lastDonationDate" type="date" onChange={handleChange} />
          </div>

          <div className="map-section">
            <h3>Select Your Location</h3>
            <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: "300px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker />
            </MapContainer>

            {formData.latitude ? (
              <p className="location-text">✅ Location: {Number(formData.latitude).toFixed(4)}, {Number(formData.longitude).toFixed(4)}</p>
            ) : (
              <p className="location-text">⚠ Click on the map to select your location</p>
            )}
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>

      {/* QR Modal */}
      {showQR && donorId && (
        <div className="qr-modal">
          <div className="qr-content">
            <h3>Your Donor QR Code</h3>
            <div id="qr-code" className="qr-box">
              <QRCodeSVG value={donorId} size={160} />
            </div>
            <p>Scan or save your QR code.</p>
            <button onClick={handleCloseQR} className="close-btn">Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
