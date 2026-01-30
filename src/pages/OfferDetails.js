import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/offerDetails.css";

export default function OfferDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, currentUserData } = useAuth();

  const [offer, setOffer] = useState(null);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadOffer();
    loadReviews();
    checkSaved();
  }, []);

  const loadOffer = async () => {
    const snap = await getDoc(doc(db, "offers", id));
    if (snap.exists()) {
      setOffer({ id: snap.id, ...snap.data() });
    }
  };

  const loadReviews = async () => {
    const snap = await getDocs(
      collection(db, "offers", id, "reviews")
    );
    setReviews(snap.docs.map((d) => d.data()));
  };

  const checkSaved = async () => {
    if (!currentUser) return;

    const q = query(
      collection(db, "users", currentUser.uid, "savedOffers"),
      where("offerId", "==", id)
    );

    const snap = await getDocs(q);
    setSaved(!snap.empty);
  };

  const toggleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const ref = collection(
      db,
      "users",
      currentUser.uid,
      "savedOffers"
    );

    const q = query(ref, where("offerId", "==", id));
    const snap = await getDocs(q);

    if (!snap.empty) {
      await deleteDoc(snap.docs[0].ref);
      setSaved(false);
    } else {
      await addDoc(ref, {
        offerId: id,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
    }
  };

  const submitReview = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "offers", id, "reviews"),
      where("userId", "==", currentUser.uid)
    );

    const snap = await getDocs(q);
    if (!snap.empty) {
      alert("You already reviewed this offer");
      return;
    }

    await addDoc(collection(db, "offers", id, "reviews"), {
      userId: currentUser.uid,
      userName:
        currentUser.displayName ||
        currentUser.email.split("@")[0],
      rating,
      comment,
      createdAt: serverTimestamp(),
    });

    setComment("");
    loadReviews();
  };

  if (!offer) return <p>Loading...</p>;

  const whatsappText = encodeURIComponent(
    `${offer.title}\nPrice: ${offer.price}\nCity: ${offer.city}\n\nView offer:\n${window.location.href}`
  );

  return (
    <div className="offer-details-container">
      <img
        src={offer.image}
        alt={offer.title}
        className="offer-main-img"
      />

      <div className="offer-details-box">
        <h1>{offer.title}</h1>

        <p className="price">₹ {offer.price}</p>
        <p>City: {offer.city}</p>

        <p className="desc">{offer.description}</p>

        <div className="offer-actions">
          <button
            className="whatsapp-btn"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${whatsappText}`,
                "_blank"
              )
            }
          >
            Share on WhatsApp
          </button>

          <button
            className="save-btn"
            onClick={toggleSave}
          >
            {saved ? "❤️ Saved" : "🤍 Save"}
          </button>
        </div>

        <hr />

        <h3>Reviews</h3>

        {reviews.length === 0 && (
          <p>No reviews yet</p>
        )}

        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            ⭐ {r.rating} — {r.userName}
            <p>{r.comment}</p>
          </div>
        ))}

        <div className="review-form">
          <h4>Add Review</h4>

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <textarea
            placeholder="Write your comment"
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

          <button onClick={submitReview}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
