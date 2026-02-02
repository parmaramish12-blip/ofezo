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
          let status = "draft";

          if (o.isPublished && o.isActive) status = "active";
          if (o.isPublished && !o.isActive) status = "disabled";

          return {
            id: d.id,
            ...o,
            status
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
  const active = offers.filter((o) => o.status === "active").length;
  const drafts = offers.filter((o) => o.status === "draft").length;

  const publishOffer = async (id) => {
    if (!isAdminUser && !hasSubscription) {
      alert("Active subscription required to publish offers.");
      return;
    }

    await updateDoc(doc(db, "offers", id), {
      isPublished: true,
      isActive: true
    });

    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, isPublished: true, isActive: true, status: "active" }
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
      isActive: value
    });

    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              isActive: value,
              status: o.isPublished
                ? value
                  ? "active"
                  : "disabled"
                : o.status
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
          <small>Active</small>
          <h3>{active}</h3>
        </div>
        <div className="stat-card">
          <small>Drafts</small>
          <h3>{drafts}</h3>
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
        <div className="grid">
          {offers.map((o) => (
            <div key={o.id} className="card offer-card">
              <img
                src={o.image || o.imageUrl || ""}
                alt={o.title}
                className="offer-img"
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 14
                }}
              />

              <h4 style={{ margin: "4px 0 6px" }}>{o.title}</h4>
              <small>
                {o.city} • {o.category}
              </small>

              <div style={{ marginTop: 10 }}>
                <span className={`badge ${o.status}`}>
                  {o.status.toUpperCase()}
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
                  onClick={() => navigate(`/offer/${o.id}`)}
                >
                  View
                </button>

                {!o.isPublished && (
                  <button
                    className="btn btn-primary"
                    onClick={() => publishOffer(o.id)}
                  >
                    Publish
                  </button>
                )}

                {o.isPublished && (
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      toggleActive(o.id, !o.isActive)
                    }
                  >
                    {o.isActive ? "Disable" : "Enable"}
                  </button>
                )}

                <button
                  className="btn btn-danger"
                  onClick={() => deleteOffer(o.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
