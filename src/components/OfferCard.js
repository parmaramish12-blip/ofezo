import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OfferCard({ offer }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const shareWhatsApp = () => {
    const url = `${window.location.origin}/offer/${offer.id}`;
    const text = `🔥 ${offer.title}\nPrice: ${offer.price}\nCheck offer 👉 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const saveOffer = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    await updateDoc(doc(db, "users", currentUser.uid), {
      savedOffers: arrayUnion(offer.id),
    });

    alert("Offer saved");
  };

  return (
    <div className="offer-card">
      <img src={offer.image} alt={offer.title} />

      <div className="offer-body">
        <h4>{offer.title}</h4>
        <p>{offer.city}</p>
        <p><b>{offer.price}</b></p>

        <button onClick={shareWhatsApp}>📤 WhatsApp</button>
        <button onClick={saveOffer}>❤️ Save</button>
      </div>
    </div>
  );
}
