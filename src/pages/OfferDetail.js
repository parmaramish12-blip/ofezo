import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/home.css";

export default function OfferDetail() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "offers", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setOffer(snap.data());

        await updateDoc(ref, {
          views: increment(1)
        });
      }
    };

    load();
  }, [id]);

  if (!offer) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div className="offer-detail-box">
      <h2>{offer.title}</h2>

      <p className="offer-shop">
        🏪 {offer.shopName || "Local Seller"}
      </p>

      <p className="offer-city">
        {offer.city} • {offer.category}
      </p>

      <h3>₹ {offer.price}</h3>

      <p className="offer-desc">
        {offer.description || "No description provided."}
      </p>

      <p className="offer-views">
        👁 {offer.views || 0} people viewed
      </p>

      <button className="contact-btn">
        📞 Contact Seller
      </button>
    </div>
  );
}
