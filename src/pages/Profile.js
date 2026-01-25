import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    category: ""
  });

  // 🔹 load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const ref = doc(db, "sellers", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm(snap.data());
        setEditMode(false);
      } else {
        setEditMode(true);
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 save or update
  const handleSave = async () => {
    if (!form.shopName || !form.phone) {
      alert("Shop name & phone required");
      return;
    }

    const ref = doc(db, "sellers", user.uid);

    if (editMode) {
      await updateDoc(ref, {
        ...form,
        updatedAt: serverTimestamp()
      });
      alert("Profile updated");
    } else {
      await setDoc(ref, {
        ...form,
        email: user.email,
        createdAt: serverTimestamp()
      });
      alert("Profile saved");
    }

    setEditMode(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div style={{ display: "flex", minHeight: "90vh" }}>
      {/* LEFT PANEL */}
      <div
        style={{
          width: 250,
          padding: 20,
          background: "#f9fafb",
          borderRight: "1px solid #e5e7eb"
        }}
      >
        <h3>Seller Panel</h3>

        <button onClick={() => navigate("/profile")}>My Profile</button>
        <button onClick={() => navigate("/dashboard")}>My Offers</button>

        <button
          onClick={handleLogout}
          style={{ background: "#ef4444", color: "#fff" }}
        >
          Logout
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, padding: 40 }}>
        <h2>My Profile</h2>

        <input
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
          placeholder="Shop Name"
          disabled={!editMode}
        />

        <input
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          placeholder="Owner Name"
          disabled={!editMode}
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Mobile Number"
          disabled={!editMode}
        />

        <input value={user.email} disabled />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Shop Address"
          disabled={!editMode}
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          disabled={!editMode}
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Business Category"
          disabled={!editMode}
        />

        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        ) : (
          <button onClick={handleSave}>
            {form.shopName ? "Update Profile" : "Save Profile"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
