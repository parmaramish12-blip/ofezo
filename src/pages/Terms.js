import React from "react";
import "../styles/terms.css";

const Terms = () => {
  return (
    <div className="terms-container">

      <div className="terms-hero">
        <h1>Terms & Conditions</h1>
        <p>
          Please read these terms carefully before using OFEZO.
        </p>
      </div>

      <div className="terms-content">

        <section>
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using the OFEZO platform, you agree to be bound by
            these Terms and Conditions. If you do not agree, please do not use
            our services.
          </p>
        </section>

        <section>
          <h2>About OFEZO</h2>
          <p>
            OFEZO is a local offers discovery platform that connects customers
            with nearby businesses. We do not sell products directly and act
            only as a discovery platform.
          </p>
        </section>

        <section>
          <h2>User Eligibility</h2>
          <p>
            Users must be at least 18 years old to register as a seller on
            OFEZO. Customers may browse offers without registration.
          </p>
        </section>

        <section>
          <h2>Seller Responsibilities</h2>
          <ul>
            <li>Sellers must provide accurate business information</li>
            <li>Offers posted must be genuine and valid</li>
            <li>Expired or misleading offers are not permitted</li>
            <li>Sellers are responsible for honoring published offers</li>
          </ul>
        </section>

        <section>
          <h2>Customer Responsibilities</h2>
          <ul>
            <li>Customers should verify offer details with the seller</li>
            <li>OFEZO is not responsible for disputes between users and sellers</li>
          </ul>
        </section>

        <section>
          <h2>Offer Validity</h2>
          <p>
            All offers displayed on OFEZO are subject to expiry dates set by
            sellers. OFEZO automatically hides expired offers but does not
            guarantee offer availability at all times.
          </p>
        </section>

        <section>
          <h2>Prohibited Activities</h2>
          <ul>
            <li>Posting false or misleading information</li>
            <li>Using the platform for illegal purposes</li>
            <li>Attempting to disrupt system security</li>
          </ul>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            OFEZO shall not be liable for any direct or indirect loss arising
            from the use of offers or interactions between users and sellers.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            OFEZO reserves the right to suspend or terminate any account that
            violates these Terms.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            These Terms may be updated periodically. Continued use of the
            platform implies acceptance of revised terms.
          </p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            For any questions regarding these Terms, contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@ofezo.com
          </p>
        </section>

      </div>

    </div>
  );
};

export default Terms;
