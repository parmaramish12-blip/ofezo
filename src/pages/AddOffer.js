import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/addOffer.css";

function AddOffer() {
  const navigate = useNavigate();
  const { currentUserData } = useAuth();

  const hasBusiness =
    currentUserData?.businessProfile &&
    currentUserData.businessProfile.businessName;

  useEffect(() => {
    if (!hasBusiness) {
      navigate("/dashboard?tab=profile");
    }
  }, [hasBusiness, navigate]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    category: "",
    description: "",
    image: "",
    expiryDate: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const publishOffer = async () => {
    if (!form.title || !form.image || !form.expiryDate) {
      alert("Title, image and expiry date required");
      return;
    }

    await addDoc(collection(db, "offers"), {
      ...form,
      sellerId: auth.currentUser.uid,
      businessName: currentUserData.businessProfile.businessName,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    alert("Offer published successfully");
    navigate("/dashboard?tab=offers");
  };

  return (
    <div className="offer-form">
      <h2>Add Offer</h2>

      <input
        name="title"
        placeholder="Offer Title"
        onChange={handleChange}
      />

      <input
        name="image"
        placeholder="Offer Image URL"
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Offer Price (optional)"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Contact Phone (optional)"
        onChange={handleChange}
      />

      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Offer Description"
        onChange={handleChange}
      />

      <label>Expiry Date</label>
      <input
        type="date"
        name="expiryDate"
        onChange={handleChange}
      />

      <button className="publish-btn" onClick={publishOffer}>
        Publish Offer
      </button>
    </div>
  );
}

export default AddOffer;
