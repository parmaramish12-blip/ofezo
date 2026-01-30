import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Business() {
  const { currentUser, currentUserData } = useAuth();

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    category: "",
    type: "",
    phone: "",
    city: "",
    year: "",
    gst: "",
    address: "",
  });

  useEffect(() => {
    if (!currentUserData?.businessProfile) return;

    setForm({
      businessName: currentUserData.businessProfile.businessName || "",
      category: currentUserData.businessProfile.category || "",
      type: currentUserData.businessProfile.type || "",
      phone: currentUserData.businessProfile.phone || "",
      city: currentUserData.businessProfile.city || "",
      year: currentUserData.businessProfile.year || "",
      gst: currentUserData.businessProfile.gst || "",
      address: currentUserData.businessProfile.address || "",
    });
  }, [currentUserData]);

  const saveBusiness = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      businessProfile: form,
    });

    setEdit(false);
  };

  return (
    <div className="business-card">
      <div className="card-header">
        <div>
          <h2>
            Business Profile
            <span className="required-badge">Required</span>
          </h2>
          <p className="card-sub">
            Required to publish offers
          </p>
        </div>

        {!edit && (
          <button className="edit-btn" onClick={() => setEdit(true)}>
            Edit
          </button>
        )}
      </div>

      <div className="form-layout">
        <input
          disabled={!edit}
          placeholder="Business Name"
          value={form.businessName}
          onChange={(e) =>
            setForm({ ...form, businessName: e.target.value })
          }
        />

        <input
          disabled={!edit}
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          disabled={!edit}
          placeholder="Business Type (Shop / Service)"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        />

        <input
          disabled={!edit}
          placeholder="Business Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          disabled={!edit}
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <input
          disabled={!edit}
          placeholder="Est. Year"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value })
          }
        />

        <input
          disabled={!edit}
          placeholder="GST (optional)"
          value={form.gst}
          onChange={(e) =>
            setForm({ ...form, gst: e.target.value })
          }
        />

        <textarea
          disabled={!edit}
          placeholder="Business Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />
      </div>

      {edit && (
        <div className="btn-row">
          <button className="btn-secondary" onClick={() => setEdit(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={saveBusiness}>
            Save Business Profile
          </button>
        </div>
      )}
    </div>
  );
}
