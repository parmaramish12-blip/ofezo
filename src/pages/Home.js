import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Home() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "offers"));

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setOffers(list);
    };

    load();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const visibleOffers = offers.filter((o) => {
    const sellerAllowed =
      o.isPublished === true &&
      o.subscriptionActive === true;

    const adminAllowed =
      o.adminApproved === true;

    return (
      (sellerAllowed || adminAllowed) &&
      o.isActive === true &&
      o.adminDisabled === false &&
      o.expiryDate &&
      o.expiryDate >= today
    );
  });

  return (
    <div style={{ padding: 40 }}>
      <h2>Latest Offers</h2>

      {visibleOffers.length === 0 && (
        <p>No active offers found</p>
      )}

      {visibleOffers.map((o) => (
        <div
          key={o.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h4>{o.title}</h4>
          <p>{o.description}</p>
          <p>Valid till: {o.expiryDate}</p>
        </div>
      ))}
    </div>
  );
}
