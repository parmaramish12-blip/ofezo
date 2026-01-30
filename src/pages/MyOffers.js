import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function MyOffers() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);

  const isSubscribed =
    userData?.subscriptionActive === true;

  const loadOffers = async () => {
    const q = query(
      collection(db, "offers"),
      where("sellerId", "==", auth.currentUser.uid)
    );

    const snap = await getDocs(q);

    const today = new Date().toISOString().split("T")[0];

    const data = snap.docs.map((d) => {
      const o = d.data();

      let status = "draft";

      if (o.isPublished && o.isActive) status = "active";
      if (o.isPublished && !o.isActive) status = "disabled";
      if (o.expiryDate < today) status = "expired";

      return { id: d.id, ...o, status };
    });

    setOffers(data);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const publishOffer = async (id) => {
    if (!isSubscribed) {
      alert("Please subscribe to publish offers");
      return;
    }

    await updateDoc(doc(db, "offers", id), {
      isPublished: true,
      isActive: true,
    });

    loadOffers();
  };

  const toggleActive = async (id, value) => {
    await updateDoc(doc(db, "offers", id), {
      isActive: value,
    });

    loadOffers();
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    await deleteDoc(doc(db, "offers", id));
    loadOffers();
  };

  return (
    <div className="dashboard-container">
      <div className="offers-header">
        <h2>My Offers </h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/add-offer")}
        >
          + Add Offer
        </button>
      </div>

      <div className="offers-grid">
        {offers.map((o) => (
          <div key={o.id} className="offer-card">
            <img src={o.image} alt={o.title} />

            <div className="offer-body">
              <h4>{o.title}</h4>

            <span className={`badge ${o.status}`}>
              {o.status.toUpperCase()}
               </span>


              {!o.isPublished && (
                <button
                  className="primary-btn"
                  onClick={() => publishOffer(o.id)}
                >
                  Publish
                </button>
              )}

              {o.isPublished && o.status !== "expired" && (
                <button
                  className="toggle-btn"
                  onClick={() =>
                    toggleActive(o.id, !o.isActive)
                  }
                >
                  {o.isActive ? "Disable" : "Enable"}
                </button>
              )}

              <button
                className="edit-btn"
                onClick={() =>
                  navigate(`/edit-offer/${o.id}`)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteOffer(o.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
