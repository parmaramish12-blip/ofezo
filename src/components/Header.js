import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Header() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.bar}>
      <h2 style={{ margin: 0 }}>OFEZO</h2>

      <button onClick={logout} style={styles.btn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  bar: {
    background: "#111827",
    color: "#fff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  btn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer"
  }
};

export default Header;
