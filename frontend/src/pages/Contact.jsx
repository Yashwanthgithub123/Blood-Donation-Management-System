import React, { useState } from "react";
import "../styles/Contact.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/contacts/add", { name, email, subject, message });
      setSuccess(res.data.message);
      setError("");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
      setSuccess("");
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        Have questions, suggestions, or want to partner with us? Reach out — we’d love to hear from you!
      </p>

      <div className="contact-container">
        {/* Left Side */}
        <div className="contact-info">
          <h2><FaMapMarkerAlt className="icon" /> Get in Touch</h2>
          <p><strong>Email:</strong> support@bloodlink.org</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Address:</strong> 123 Life Saver Street, Bengaluru, India</p>
          <div className="social-icons">
            <FaFacebook className="social" />
            <FaTwitter className="social" />
            <FaInstagram className="social" />
          </div>
        </div>

        {/* Right Side */}
        <div className="contact-form">
          <h2><FaEnvelope className="icon" /> Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message..."
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit">Send Message</button>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
