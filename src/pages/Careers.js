import React from "react";
import "../styles/careers.css";

const Careers = () => {
  return (
    <div className="careers-container">

      <div className="careers-hero">
        <h1>Careers at OFEZO</h1>
        <p>
          Build the future of local commerce with us.
        </p>
      </div>

      <div className="careers-content">

        <section className="careers-section">
          <h2>Why Work With OFEZO?</h2>
          <p>
            OFEZO is building a platform focused on empowering local businesses
            and helping customers discover genuine nearby offers. We believe in
            simplicity, transparency, and community-driven growth.
          </p>
        </section>

        <section className="careers-section">
          <h2>Our Culture</h2>
          <ul>
            <li>Ownership-driven mindset</li>
            <li>Learning and growth focused</li>
            <li>Open communication</li>
            <li>Respect for ideas</li>
            <li>Startup agility</li>
          </ul>
        </section>

        <section className="careers-section highlight">
          <h2>Open Positions</h2>
          <p>
            We are currently expanding our team. If you are passionate about
            startups, technology, or local business growth, we would love to
            hear from you.
          </p>

          <ul>
            <li>Frontend Developer (React)</li>
            <li>Backend / Firebase Developer</li>
            <li>Marketing & Partnerships</li>
            <li>City Operations Coordinator</li>
          </ul>
        </section>

        <section className="careers-section">
          <h2>Who Can Apply?</h2>
          <ul>
            <li>Students and freshers</li>
            <li>Freelancers</li>
            <li>Experienced professionals</li>
            <li>Startup enthusiasts</li>
          </ul>
        </section>

        <section className="careers-section">
          <h2>How to Apply</h2>
          <p>
            Send your resume or profile details to:
          </p>
          <p>
            <strong>Email:</strong> careers@ofezo.com
          </p>
          <p>
            Please mention the role you are applying for in the subject line.
          </p>
        </section>

      </div>

    </div>
  );
};

export default Careers;
