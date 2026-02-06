// src/pages/AddOffer.jsx

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import {
  canCreateOffer,
  getSubscriptionLabel,
} from "../utils/subscriptionUtils";
import "../styles/dashboard.css";

const ADMIN_EMAIL = "parmaramish12@gmail.com";

export default function AddOffer() {
  const { currentUser, currentUserData, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("draft"); // 'published' or 'draft'
  const [saving, setSaving] = useState(false);

  const isAdminUser =
    currentUser?.email === ADMIN_EMAIL;

  if (loading) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  if (!isAdminUser && !canCreateOffer(currentUserData)) {
    return (
      <div className="dashboard-container">
        <div className="blocked-box">
          <h2>Subscription required</h2>
          <p style={{ marginTop: 8 }}>
            Your current plan: {getSubscriptionLabel(currentUserData)}
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    if (!title || !description || !city || !category || !expiryDate) {
      alert("All fields required");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "offers"), {
        title,
        description,
        city,
        category,
        image,
        expiryDate: new Date(expiryDate),
        sellerId: currentUser.uid,
        businessName: currentUserData?.businessProfile?.businessName || currentUserData?.name || "",
        businessAddress: currentUserData?.businessProfile?.address || "",
        businessPhone: currentUserData?.businessProfile?.phone || currentUserData?.phone || "",
        businessCategory: currentUserData?.businessProfile?.category || category,
        status: status, // 'published' or 'draft'
        isActive: status === 'published', // Only active if published
        isPublished: status === 'published', // Only published if status is 'published'
        createdAt: serverTimestamp(),
      });

      alert("Offer added successfully");

      setTitle("");
      setDescription("");
      setCity("");
      setCategory("");
      setImage("");
      setExpiryDate("");
      setStatus("draft"); // Reset to default
    } catch (err) {
      console.error(err);
      alert("Failed to add offer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="business-card">
        <div className="card-header">
          <div>
            <h2>Create a new offer</h2>
            <p className="card-sub">
              Highlight your best deal with a clear title, image and expiry.
            </p>
          </div>
          <span className="required-badge">All fields required</span>
        </div>

        <form onSubmit={submit}>
          <div className="form-layout">
            <input
              placeholder="Offer title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            <textarea
              placeholder="Short description of the offer"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div>
              <label style={{ fontSize: 13, color: "#6b7280" }}>
                Expiry date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{ marginTop: 6 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "#6b7280" }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px"
                }}
              >
                <option value="draft">Draft (Save as draft)</option>
                <option value="published">Published (Make live)</option>
              </select>
            </div>
          </div>

          <div className="btn-row">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Add offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
