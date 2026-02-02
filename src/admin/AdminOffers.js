import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminOfferCard from "./AdminOfferCard";

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "offers"));
      setOffers(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    };

    load();
  }, []);

  return (
    <div>
      <h2>All Offers</h2>

      {offers.length === 0 && <p>No offers found</p>}

      {offers.map((offer) => (
        <AdminOfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
};

export default AdminOffers;
