import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { currentUser, currentUserData } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = async () => {
    setOpen(false);
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const go = (path) => {
    setOpen(false);
    navigate(path, { replace: true });
  };

  // 🔒 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  const displayName =
    currentUserData?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0];

  return (
    <nav className="navbar">
      <div className="nav-wrapper">

        {/* LOGO */}
        <div
          className="nav-left logo"
          onClick={() => navigate("/", { replace: true })}
        >
          <img 
            src="/logo.svg" 
            alt="OFEZO" 
            className="logo-img"
          />
          <span className="brand-name">OFEZO</span>
        </div>

        <div className="nav-right">

          <span
            className="nav-link"
            onClick={() => navigate("/", { replace: true })}
          >
            Home
          </span>

          {!currentUser && (
            <span
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          )}

          {currentUser && (
            <div className="user-box" ref={dropdownRef}>
              <span
                className="user-name"
                onClick={() => setOpen(!open)}
              >
                {displayName} ▼
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
                    Saved Offers
                  </button>
                  <button onClick={() => go("/dashboard?tab=subscription")}>
                    Subscription
                  </button>
                  <button className="logout-btn" onClick={logout}>
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
