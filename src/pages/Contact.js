import React from "react";
import "../styles/contact.css";

const Contact = () => {
  return (
    <div className="contact-container">

      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We’re here to help. Reach out to OFEZO anytime.
        </p>
      </div>

      <div className="contact-content">

        <div className="contact-box">
          <h3>📍 Office Address</h3>
          <p>
            OFEZO Technologies<br />
            Vadodara, Gujarat, India
          </p>
        </div>

        <div className="contact-box">
          <h3>📞 Phone</h3>
          <p>+91 9XXXXXXXXX</p>
        </div>

        <div className="contact-box">
          <h3>📧 Email</h3>
          <p>support@ofezo.com</p>
        </div>

        <div className="contact-box">
          <h3>⏰ Support Timing</h3>
          <p>Monday – Friday<br />10:00 AM – 7:00 PM</p>
        </div>

      </div>

    </div>
  );
};

export default Contact;
