import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import Business from "./Business";
import "../styles/dashboard.css";

export default function Profile() {
  const { currentUser, currentUserData } = useAuth();

  const [edit, setEdit] = useState(false);
  const [editInterests, setEditInterests] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    interests: "", // Add interests field
  });

  useEffect(() => {
    if (!currentUserData) return;

    setForm({
      name: currentUserData.name || "",
      phone: currentUserData.phone || "",
      city: currentUserData.city || "",
      state: currentUserData.state || "",
      interests: currentUserData.interests || "", // Load interests
    });
  }, [currentUserData]);

  const saveProfile = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), form);
    setEdit(false);
  };

  const saveInterests = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      interests: form.interests
    });
    setEditInterests(false);
  };

  // Check if user is a seller (has business profile or has created offers)
  const isSeller = currentUserData?.businessProfile || 
                   currentUserData?.role === 'seller' ||
                   currentUserData?.role === 'admin';

  if (!currentUserData) return null;

  return (
    <>
      {/* PERSONAL PROFILE - FOR ALL USERS */}
      <div className="profile-card">
        <div className="card-header">
          <div>
            <h2>My Profile</h2>
            <p className="card-sub">
              {isSeller ? "Seller Personal Details" : "Personal Details"}
            </p>
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

      {/* INTERESTS SECTION - ONLY FOR REGULAR USERS */}
      {!isSeller && (
        <div className="profile-card">
          <div className="card-header">
            <div>
              <h2>My Interests</h2>
              <p className="card-sub">Tell us what you're interested in</p>
            </div>

            {!editInterests && (
              <button className="edit-btn" onClick={() => setEditInterests(true)}>
                Edit
              </button>
            )}
          </div>

          <div className="form-layout">
            <textarea
              disabled={!editInterests}
              placeholder="Your interests (e.g., Food, Shopping, Electronics, Travel...)"
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          {editInterests && (
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setEditInterests(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveInterests}>
                Save Interests
              </button>
            </div>
          )}
        </div>
      )}

      {/* BUSINESS PROFILE - ONLY FOR SELLERS */}
      {isSeller && <Business />}
    </>
  );
}
