import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo">OFEZO</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
