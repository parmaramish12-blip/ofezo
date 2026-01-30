import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { currentUser, currentUserData } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    setOpen(false);
    await signOut(auth);
    navigate("/");
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const hasBusiness =
    currentUserData?.businessProfile?.businessName;

  return (
    <nav className="navbar">
      <div className="nav-wrapper">

        <div className="nav-left">
          <Link to="/" className="logo">OFEZO</Link>
        </div>

        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>

          {!currentUser && (
            <Link to="/login" className="login-btn">Login</Link>
          )}

          {currentUser && (
            <div className="user-box">
              <span
                className="user-name"
                onClick={() => setOpen(!open)}
              >
                {currentUser.displayName ||
                  currentUser.email.split("@")[0]} ▼
              </span>

              {open && (
                <div className="dropdown">

                  <button onClick={() => go("/dashboard?tab=profile")}>
                    My Profile
                  </button>

                 
                  <button onClick={() => go("/dashboard?tab=offers")}>
                    My Offers
                  </button>

                  <button onClick={() => go("/dashboard?tab=saved")}>
                    Saved Offer
                  </button>

                  <button onClick={() => go("/dashboard?tab=subscription")}>
                    Subscription
                  </button>

                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
