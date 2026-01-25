import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-grid">

        {/* ABOUT */}
        <div>
          <h3>OFEZO</h3>
          <p>
            OFEZO helps customers discover the best local offers near their city.
            We connect shops and buyers through verified deals.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Careers</li>
            <li>Support</li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4>Legal</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h4>Follow Us</h4>
          <div className="social">
            <span>🌐</span>
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} OFEZO. All rights reserved.
      </div>

    </footer>
  );
}
