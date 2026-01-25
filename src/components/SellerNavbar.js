import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/ui.css";

function SellerNavbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="seller-nav">
      <h3>Seller Panel</h3>

      <div className="seller-links">
        <button onClick={() => navigate("/dashboard")}>My Offers</button>
        <button onClick={() => navigate("/add-offer")}>Add Offer</button>
        <button onClick={() => navigate("/profile")}>My Profile</button>
        <button className="danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default SellerNavbar;
