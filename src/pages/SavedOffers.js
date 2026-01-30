import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function SavedOffers() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    loadSavedOffers();
  }, [currentUser]);

  const loadSavedOffers = async () => {
    try {
      const savedSnap = await getDocs(
        collection(db, "users", currentUser.uid, "savedOffers")
      );

      const list = [];

      for (let docSnap of savedSnap.docs) {
        const offerId = docSnap.data().offerId;

        const offerSnap = await getDoc(
          doc(db, "offers", offerId)
        );

        if (offerSnap.exists()) {
          list.push({
            id: offerSnap.id,
            ...offerSnap.data(),
            savedDocId: docSnap.id,
          });
        }
      }

      setOffers(list);
    } catch (err) {
      console.error("Saved offers error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeSaved = async (savedDocId) => {
    await deleteDoc(
      doc(
        db,
        "users",
        currentUser.uid,
        "savedOffers",
        savedDocId
      )
    );

    setOffers((prev) =>
      prev.filter((o) => o.savedDocId !== savedDocId)
    );
  };

  if (loading)
    return <p style={{ padding: 30 }}>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h2>Saved Offers</h2>

      {offers.length === 0 ? (
        <p>No saved offers yet.</p>
      ) : (
        <div className="offers-grid">
          {offers.map((o) => (
            <div
              key={o.id}
              className="offer-card"
              onClick={() =>
                navigate(`/offer/${o.id}`)
              }
            >
              <img src={o.image} alt={o.title} />

              <div className="offer-body">
                <h4>{o.title}</h4>
                <p>{o.city}</p>
                <p>
                  <b>{o.price}</b>
                </p>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSaved(o.savedDocId);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
