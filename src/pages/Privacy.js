import React from "react";
import "../styles/privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-container">

      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is important to us.
        </p>
      </div>

      <div className="privacy-content">

        <section>
          <h2>Introduction</h2>
          <p>
            OFEZO respects your privacy and is committed to protecting your
            personal information. This Privacy Policy explains how we collect,
            use, and safeguard your data when you use our platform.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li>Name, email address, and contact number</li>
            <li>Business details provided by sellers</li>
            <li>Location and city information</li>
            <li>Usage data for improving our services</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve OFEZO services</li>
            <li>To display relevant local offers</li>
            <li>To communicate important updates</li>
            <li>To ensure platform security</li>
          </ul>
        </section>

        <section>
          <h2>Data Sharing</h2>
          <p>
            We do not sell or rent your personal data to third parties. Data may
            be shared only when required by law or for essential service
            functionality.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your information against unauthorized access, alteration,
            or misuse.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            OFEZO may use cookies to enhance user experience and analyze
            platform performance.
          </p>
        </section>

        <section>
          <h2>User Rights</h2>
          <p>
            Users have the right to access, update, or request deletion of their
            personal data by contacting our support team.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be
            reflected on this page with revised dates.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            For any privacy-related questions, contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@ofezo.com
          </p>
        </section>

      </div>

    </div>
  );
};

export default Privacy;
