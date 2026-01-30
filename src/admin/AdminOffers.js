import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminRoute from "../components/AdminRoute";

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const snap = await getDocs(collection(db, "offers"));

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setOffers(list);
      } catch (err) {
        console.error("ADMIN OFFER ERROR:", err);
        alert("Firestore permission issue");
      }

      setLoading(false);
    };

    loadOffers();
  }, []);

  if (loading) {
    return (
      <AdminRoute>
        <p style={{ padding: 40 }}>Loading offers...</p>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div style={{ padding: 40 }}>
        <h2>Admin Offers</h2>

        {offers.length === 0 && (
          <p>No offers found</p>
        )}

        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h4>{offer.title}</h4>

            <p>
              Seller Active:{" "}
              {offer.isActive ? "✅" : "❌"} <br />
              Admin Disabled:{" "}
              {offer.adminDisabled ? "🚫" : "🟢"}
            </p>
          </div>
        ))}
      </div>
    </AdminRoute>
  );
}
