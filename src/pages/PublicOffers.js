import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase/firebase";

function PublicOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "offers"),
        where("isActive", "==", true)
      );

      const snap = await getDocs(q);

      const now = new Date();

      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(o => !o.expiryDate || o.expiryDate.toDate() > now);

      setOffers(data);
    };

    fetch();
  }, []);

  return (
    <div className="container">
      <h2>Available Offers</h2>

      <div className="grid">
        {offers.map(o => (
          <div key={o.id} className="card">
            <h3>{o.title}</h3>
            <p>{o.city}</p>
            <p>₹ {o.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicOffers;
