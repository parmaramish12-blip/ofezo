import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import Business from "./Business";
import "../styles/dashboard.css";

export default function Profile() {
  const { currentUser, currentUserData } = useAuth();

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (!currentUserData) return;

    setForm({
      name: currentUserData.name || "",
      phone: currentUserData.phone || "",
      city: currentUserData.city || "",
      state: currentUserData.state || "",
    });
  }, [currentUserData]);

  const saveProfile = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), form);
    setEdit(false);
  };

  if (!currentUserData) return null;

  return (
    <>
      {/* PERSONAL PROFILE */}
      <div className="profile-card">
        <div className="card-header">
          <div>
            <h2>My Profile</h2>
            <p className="card-sub">Personal details</p>
          </div>

          {!edit && (
            <button className="edit-btn" onClick={() => setEdit(true)}>
              Edit
            </button>
          )}
        </div>

        <div className="form-layout">
          <input disabled={!edit} value={form.name} placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input disabled={!edit} value={form.phone} placeholder="Phone Number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <input disabled={!edit} value={form.city} placeholder="City"
            onChange={(e) => setForm({ ...form, city: e.target.value })} />

          <input disabled={!edit} value={form.state} placeholder="State"
            onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </div>

        {edit && (
          <div className="btn-row">
            <button className="btn-secondary" onClick={() => setEdit(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        )}
      </div>

      {/* BUSINESS PROFILE */}
      <Business />
    </>
  );
}
