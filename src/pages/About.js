import React from "react";
import "../styles/about.css";

function About() {
  return (
    <div className="about-container">

      {/* HERO */}
      <div className="about-hero">
        <h1>About OFEZO</h1>
        <p>Discover local offers. Support nearby businesses.</p>
      </div>

      {/* STORY */}
      <div className="about-section">
        <h2>Our Story</h2>
        <p>
          OFEZO was created after observing one simple problem — local businesses
          offer great deals every day, but customers often do not know about
          them.
        </p>
        <p>
          At the same time, customers are frustrated with fake discounts and
          expired offers on big platforms.
        </p>
        <p>
          This gap between local sellers and real buyers inspired the birth of
          OFEZO.
        </p>
      </div>

      {/* WHY */}
      <div className="about-section about-highlight">
        <h2>Why OFEZO Exists</h2>
        <p>
          OFEZO connects nearby sellers and customers through genuine,
          location-based offers — without spam or misleading promotions.
        </p>
      </div>

      {/* MISSION */}
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          To empower local businesses digitally and help customers save money
          through real and verified local offers.
        </p>
      </div>

      {/* VISION */}
      <div className="about-section">
        <h2>Our Vision</h2>
        <p>
          To become India’s most trusted local offers discovery platform,
          expanding city by city.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="about-section about-highlight">
        <h2>How OFEZO Works</h2>
        <ul>
          <li>Select your city</li>
          <li>Browse active local offers</li>
          <li>Only valid offers are shown</li>
          <li>Expired offers hide automatically</li>
          <li>Sellers manage offers easily</li>
        </ul>
      </div>

      {/* USERS */}
      <div className="about-section">
        <h2>For Customers</h2>
        <ul>
          <li>Discover nearby offers instantly</li>
          <li>Save money daily</li>
          <li>Simple and clean experience</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>For Sellers</h2>
        <ul>
          <li>Create digital presence</li>
          <li>Reach nearby customers</li>
          <li>Manage offers anytime</li>
        </ul>
      </div>

      {/* FOOTER LINE */}
      <div className="about-footer-line">
        OFEZO — Empowering Local Businesses, One City at a Time.
      </div>

    </div>
  );
}

export default About;
