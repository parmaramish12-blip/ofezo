import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/ui.css";

function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const loadOffer = async () => {
      const ref = doc(db, "offers", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Offer not found");
        navigate("/dashboard");
        return;
      }

      const data = snap.data();

      setTitle(data.title || "");
      setDescription(data.description || "");
      setPrice(data.price || "");
      setCity(data.city || "");
      setCategory(data.category || "");

      if (data.expiryDate) {
        const date = data.expiryDate.toDate();
        setExpiryDate(date.toISOString().split("T")[0]);
      }

      setLoading(false);
    };

    loadOffer();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !city || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const ref = doc(db, "offers", id);

      await updateDoc(ref, {
        title,
        description,
        price,
        city,
        category,
        expiryDate: expiryDate
          ? Timestamp.fromDate(new Date(expiryDate))
          : null
      });

      alert("Offer updated successfully ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Update failed ❌");
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Edit Offer</h2>

      <form className="card" onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Offer title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          <option>Vadodara</option>
          <option>Ahmedabad</option>
          <option>Surat</option>
          <option>Anand</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option>Electronics</option>
          <option>Food</option>
          <option>Furniture</option>
          <option>Clothing</option>
          <option>Gym</option>
          <option>Salon</option>
        </select>

        <label>Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <button className="btn btn-primary" style={{ marginTop: 15 }}>
          Update Offer
        </button>
      </form>
    </div>
  );
}

export default EditOffer;
