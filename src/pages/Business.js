import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

const emptyBusiness = {
  businessName: "",
  businessType: "",
  category: "",
  city: "",
  phone: "",
  isCompleted: false,
};

export default function Business() {
  const { currentUser, currentUserData, setCurrentUserData } = useAuth();

  const [form, setForm] = useState(emptyBusiness);

  // ✅ ALWAYS sync from context
  useEffect(() => {
    if (currentUserData?.business) {
      setForm({
        ...emptyBusiness,
        ...currentUserData.business,
      });
    }
  }, [currentUserData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    if (!form.businessName || !form.phone) {
      alert("Business name & phone required");
      return;
    }

    const finalData = {
      ...form,
      isCompleted: true,
    };

    await updateDoc(doc(db, "users", currentUser.uid), {
      business: finalData,
      updatedAt: serverTimestamp(),
    });

    // 🔥 THIS IS THE KEY FIX
    setCurrentUserData((prev) => ({
      ...prev,
      business: finalData,
    }));

    alert("Business profile saved successfully");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Business Profile</h2>

      <input
        name="businessName"
        placeholder="Business Name"
        value={form.businessName}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Business Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />

      <select
        name="businessType"
        value={form.businessType}
        onChange={handleChange}
      >
        <option value="">Business Type</option>
        <option>Shop</option>
        <option>Service</option>
        <option>Manufacturer</option>
        <option>Wholesaler</option>
      </select>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="">Category</option>
        <option>Furniture</option>
        <option>Electronics</option>
        <option>Fashion</option>
        <option>Food</option>
        <option>Beauty</option>
      </select>

      <button onClick={save}>Save Business</button>
    </div>
  );
}
