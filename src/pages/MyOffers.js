import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const ADMIN_EMAIL = "parmaramish12@gmail.com";

export default function MyOffers() {
  const { currentUser, currentUserData } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const loadOffers = async () => {
      try {
        const q = query(
          collection(db, "offers"),
          where("sellerId", "==", currentUser.uid)
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((d) => {
          const o = d.data();
          let status = o.status || "draft"; // Use status field or default to draft
          
          // Check if offer is expired
          const today = new Date();
          const expiryDate = o.expiryDate ? 
            (typeof o.expiryDate.toDate === "function" ? o.expiryDate.toDate() : new Date(o.expiryDate)) :
            null;
          
          const isExpired = expiryDate && expiryDate < today;
          
          // Update status based on expiry
          if (isExpired && status === "published") {
            status = "expired";
          }

          return {
            id: d.id,
            ...o,
            status,
            expiryDate,
            isExpired
          };
        });

        setOffers(data);
      } catch (e) {
        console.error("Load offers error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [currentUser]);

  if (loading) {
    return <p style={{ padding: 30 }}>Loading offers...</p>;
  }

  const isAdminUser =
    currentUser?.email === ADMIN_EMAIL;

  const hasSubscription =
    currentUserData?.subscription?.active === true;

  const total = offers.length;
  const published = offers.filter((o) => o.status === "published").length;
  const drafts = offers.filter((o) => o.status === "draft").length;
  const expired = offers.filter((o) => o.status === "expired").length;

  const publishOffer = async (id) => {
    // TEMPORARILY DISABLED: Allow all users to publish offers
    // if (!isAdminUser && !hasSubscription) {
    //   alert("Active subscription required to publish offers.");
    //   return;
    // }

    await updateDoc(doc(db, "offers", id), {
      status: "published",
      isPublished: true,
      isActive: true
    });

    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "published", isPublished: true, isActive: true }
          : o
      )
    );
  };

  const toggleActive = async (id, value) => {
    // Sellers need subscription to re‑activate;
    // they can always disable. Admin bypasses subscription.
    if (!isAdminUser && !hasSubscription && value === true) {
      alert("Active subscription required to enable offers.");
      return;
    }

    await updateDoc(doc(db, "offers", id), {
      isActive: value,
      status: value ? "published" : "draft"
    });

    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              isActive: value,
              status: value ? "published" : "draft"
            }
          : o
      )
    );
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;

    await deleteDoc(doc(db, "offers", id));
    setOffers((prev) =>
      prev.filter((o) => o.id !== id)
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>My Offers</h2>
          <p className="card-sub">
            Manage all your live, draft and disabled offers in one place.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-offer")}
        >
          + Add Offer
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <small>Total Offers</small>
          <h3>{total}</h3>
        </div>
        <div className="stat-card">
          <small>Published</small>
          <h3>{published}</h3>
        </div>
        <div className="stat-card">
          <small>Drafts</small>
          <h3>{drafts}</h3>
        </div>
        <div className="stat-card">
          <small>Expired</small>
          <h3>{expired}</h3>
        </div>
      </div>

      {offers.length === 0 && (
        <div className="blocked-box">
          <h3>No offers yet</h3>
          <p style={{ marginTop: 8 }}>
            Start by creating your first offer. It takes less than a minute.
          </p>
          <button
            className="btn btn-accent"
            style={{ marginTop: 18 }}
            onClick={() => navigate("/add-offer")}
          >
            Create first offer
          </button>
        </div>
      )}

      {offers.length > 0 && (
        <div>
          {/* Published Offers Section */}
          {offers.filter(o => o.status === 'published').length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ marginBottom: 15, color: '#22c55e' }}>📢 Published Offers</h3>
              <div className="grid">
                {offers.filter(o => o.status === 'published').map((o) => (
                  <OfferCard key={o.id} offer={o} onPublish={publishOffer} onToggle={toggleActive} onDelete={deleteOffer} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {/* Draft Offers Section */}
          {offers.filter(o => o.status === 'draft').length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ marginBottom: 15, color: '#6b7280' }}>📝 Draft Offers</h3>
              <div className="grid">
                {offers.filter(o => o.status === 'draft').map((o) => (
                  <OfferCard key={o.id} offer={o} onPublish={publishOffer} onToggle={toggleActive} onDelete={deleteOffer} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {/* Expired Offers Section */}
          {offers.filter(o => o.status === 'expired').length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ marginBottom: 15, color: '#ef4444' }}>⏰ Expired Offers</h3>
              <div className="grid">
                {offers.filter(o => o.status === 'expired').map((o) => (
                  <OfferCard key={o.id} offer={o} onPublish={publishOffer} onToggle={toggleActive} onDelete={deleteOffer} navigate={navigate} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Offer Card Component
function OfferCard({ offer, onPublish, onToggle, onDelete, navigate }) {
  return (
    <div key={offer.id} className="card offer-card">
      <img
        src={offer.image || offer.imageUrl || ""}
        alt={offer.title}
        className="offer-img"
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: 12,
          marginBottom: 14
        }}
      />

      <h4 style={{ margin: "4px 0 6px" }}>{offer.title}</h4>
      <small>
        {offer.city} • {offer.category}
      </small>
      
      {offer.expiryDate && (
        <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0' }}>
          Expires: {offer.expiryDate.toLocaleDateString()}
        </p>
      )}

      <div style={{ marginTop: 10 }}>
        <span className={`badge ${offer.status}`}>
          {offer.status.toUpperCase()}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap"
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/offer/${offer.id}`)}
        >
          View
        </button>

        {offer.status === 'draft' && (
          <button
            className="btn btn-primary"
            onClick={() => onPublish(offer.id)}
          >
            Publish
          </button>
        )}

        {offer.status === 'published' && (
          <button
            className="btn btn-secondary"
            onClick={() => onToggle(offer.id, !offer.isActive)}
          >
            {offer.isActive ? "Disable" : "Enable"}
          </button>
        )}

        <button
          className="btn btn-danger"
          onClick={() => onDelete(offer.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
