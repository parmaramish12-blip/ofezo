import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/addOffer.css";

export default function AddOffer() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [form, setForm] = useState({
    title: "",
    image: "",
    price: "",
    city: "",
    category: "",
    description: "",
    phone: "",
    expiryDate: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveDraft = async () => {
    if (!form.title || !form.expiryDate) {
      alert("Title & expiry date required");
      return;
    }

    await addDoc(collection(db, "offers"), {
      ...form,
      sellerId: auth.currentUser.uid,
      businessName:
        userData?.businessProfile?.businessName || "",
      isPublished: false, // ✅ DRAFT
      isActive: false,
      createdAt: serverTimestamp(),
    });

    alert("Offer saved as draft");
    navigate("/dashboard?tab=offers");
  };

  return (
    <div className="offer-form">
      <h2>Create Offer</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="image" placeholder="Image URL" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <input
        type="date"
        name="expiryDate"
        onChange={handleChange}
      />

      <button onClick={saveDraft}>
        Save Offer (Draft)
      </button>
    </div>
  );
}
