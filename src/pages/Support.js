import React from "react";
import "../styles/support.css";

const Support = () => {
  return (
    <div className="support-container">

      <div className="support-hero">
        <h1>Support</h1>
        <p>
          We are here to help you with OFEZO.
        </p>
      </div>

      <div className="support-content">

        <section className="support-section">
          <h2>How Can We Help You?</h2>
          <p>
            At OFEZO, we aim to provide smooth and reliable experience for both
            customers and sellers. If you face any issues, feel free to reach
            out to us.
          </p>
        </section>

        <section className="support-section highlight">
          <h2>Common Support Topics</h2>
          <ul>
            <li>Login or account related issues</li>
            <li>Offer not visible or expired</li>
            <li>Incorrect business information</li>
            <li>Technical or website issues</li>
            <li>General queries and feedback</li>
          </ul>
        </section>

        <section className="support-section">
          <h2>Support Contact</h2>
          <p>
            You can reach our support team through the following channels:
          </p>
          <p>
            <strong>Email:</strong> support@ofezo.com
          </p>
          <p>
            <strong>Phone:</strong> +91 9XXXXXXXXX
          </p>
        </section>

        <section className="support-section">
          <h2>Support Timings</h2>
          <p>
            Monday – Saturday<br />
            10:00 AM – 7:00 PM
          </p>
        </section>

        <section className="support-section">
          <h2>Response Time</h2>
          <p>
            Our team usually responds within 24 working hours.
          </p>
        </section>

      </div>

    </div>
  );
};

export default Support;
