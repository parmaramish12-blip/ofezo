import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function AddOffer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    category: "",
    description: "",
    image: "",
    expiryDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const publishOffer = async () => {
    if (!form.title || !form.expiryDate) {
      alert("Title and expiry date required");
      return;
    }

    await addDoc(collection(db, "offers"), {
      ...form,
      sellerId: auth.currentUser.uid,
      isActive: true,
      createdAt: serverTimestamp()
    });

    alert("Offer published");
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h2>Add Offer</h2>

      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />
      <input name="image" placeholder="Image URL" onChange={handleChange} />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <label>Expiry Date</label>
      <input
        type="date"
        name="expiryDate"
        onChange={handleChange}
      />

      <button onClick={publishOffer}>Publish</button>
    </div>
  );
}

export default AddOffer;
