import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div>
          <h3>OFEZO</h3>
          <p>
            OFEZO helps customers discover the best local offers near their city.
            We connect shops and buyers through verified deals.
          </p>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
          </ul>
        </div>

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
