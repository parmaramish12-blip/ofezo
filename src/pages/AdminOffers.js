import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    const snap = await getDocs(collection(db, "offers"));

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setOffers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const toggleApproval = async (offer) => {
    await updateDoc(doc(db, "offers", offer.id), {
      adminApproved: !offer.adminApproved,
    });

    loadOffers();
  };

  if (loading) {
    return <p>Loading offers...</p>;
  }

  return (
    <div>
      <h2>All Offers</h2>

      {offers.map((offer) => (
        <div
          key={offer.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
        >
          <h4>{offer.title}</h4>

          <p>
            Seller Published: {offer.isPublished ? "✅" : "❌"} <br />
            Subscription: {offer.subscriptionActive ? "✅" : "❌"} <br />
            Admin Approved: {offer.adminApproved ? "🟢" : "🔴"}
          </p>

          <button
            onClick={() => toggleApproval(offer)}
            style={{
              background: offer.adminApproved
                ? "#dc3545"
                : "#198754",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {offer.adminApproved
              ? "Remove Approval"
              : "Approve Offer"}
          </button>
        </div>
      ))}
    </div>
  );
}
