import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function SavedOffers() {
  const { currentUser } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const loadSaved = async () => {
      const snap = await getDocs(
        collection(db, "users", currentUser.uid, "savedOffers")
      );

      const list = [];

      for (let s of snap.docs) {
        const offerSnap = await getDoc(
          doc(db, "offers", s.data().offerId)
        );
        if (offerSnap.exists()) {
          list.push({
            id: offerSnap.id,
            ...offerSnap.data(),
            savedId: s.id,
          });
        }
      }

      setOffers(list);
      setLoading(false);
    };

    loadSaved();
  }, [currentUser]);

  if (loading) return <p style={{ padding: 30 }}>Loading…</p>;

  return (
    <div className="dashboard-container">
      <h2>Saved Offers</h2>

      {offers.length === 0 ? (
        <p>No saved offers</p>
      ) : (
        <div className="offers-grid">
          {offers.map((o) => (
            <div key={o.id} className="offer-card">
              <img
                src={o.image || o.imageUrl || ""}
                alt={o.title}
                className="offer-img"
              />

              <div className="offer-body">
                <h4>{o.title}</h4>
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteDoc(
                      doc(
                        db,
                        "users",
                        currentUser.uid,
                        "savedOffers",
                        o.savedId
                      )
                    )
                  }
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
