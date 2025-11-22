import React from "react";
import "../styles/About.css";
import { FaHeart, FaTint, FaHandshake, FaUserAstronaut } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">
      <h1>About <span className="highlight">BloodLink</span></h1>
      <p className="about-intro">
        BloodLink is a life-saving platform designed to connect blood donors with those in urgent need.
        We aim to bridge the gap between blood availability and those seeking help during emergencies.
      </p>

      <div className="about-cards">
        <div className="about-card">
          <FaTint className="about-icon blue" />
          <h3>Our Mission</h3>
          <p>
            To build a reliable, easy-to-use, and transparent platform where donors and recipients can
            connect seamlessly — promoting a culture of regular blood donation and community care.
          </p>
        </div>

        <div className="about-card">
          <FaHeart className="about-icon sky" />
          <h3>Our Vision</h3>
          <p>
            We envision a world where no one dies due to lack of blood — a future made possible through
            technology, awareness, and humanity working together.
          </p>
        </div>

        <div className="about-card">
          <FaHandshake className="about-icon teal" />
          <h3>How It Works</h3>
          <p>
            Users can register as donors, search for nearby donors based on blood group and location,
            and connect instantly. BloodLink ensures safety and simplicity in every step.
          </p>
        </div>
      </div>

      <div className="about-footer">
        <FaUserAstronaut className="dev-icon" />
        <h3>Developed By</h3>
        <p>
          <b>Veeresh S</b> — passionate about using technology to save lives through innovation and
          community-driven solutions.
        </p>
      </div>
    </div>
  );
};

export default About;