import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export default function AddOffer() {
  const { userData } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveOffer = async () => {
    if (!form.title || !form.expiryDate) {
      alert("Title and expiry required");
      return;
    }

    await addDoc(collection(db, "offers"), {
      ...form,

      sellerId: auth.currentUser.uid,
      businessName:
        userData?.businessProfile?.businessName || "",

      // 🔐 CORE LOGIC
      isPublished: false,          // seller publish
      subscriptionActive: false,   // paid?
      adminApproved: false,        // ⭐ admin override
      isActive: true,
      adminDisabled: false,

      createdAt: serverTimestamp(),
    });

    alert("Offer saved as draft");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Add Offer</h2>

      <input
        name="title"
        placeholder="Offer title"
        value={form.title}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="date"
        name="expiryDate"
        value={form.expiryDate}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={saveOffer}>
        Save Draft
      </button>
    </div>
  );
}
