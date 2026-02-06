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
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/offerDetails.css";

const ADMIN_EMAIL = "parmaramish12@gmail.com";

export default function OfferDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, currentUserData } = useAuth();

  const [offer, setOffer] = useState(null);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadOffer();
    loadReviews();
    checkSaved();
  }, [id, currentUser, loadOffer, loadReviews, checkSaved]);

  // 👀 VIEW COUNT
  const loadOffer = async () => {
    const ref = doc(db, "offers", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setOffer({ id: snap.id, ...snap.data() });

      try {
        await updateDoc(ref, {
          views: increment(1),
        });
      } catch (err) {
        // ignore analytics permission errors for public viewers
        console.warn("Views increment failed:", err);
      }
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

  // ❤️ SAVE COUNT
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

    const offerRef = doc(db, "offers", id);

    if (!snap.empty) {
      await deleteDoc(snap.docs[0].ref);
      await updateDoc(offerRef, {
        saves: increment(-1),
      });
      setSaved(false);
    } else {
      await addDoc(ref, {
        offerId: id,
        createdAt: serverTimestamp(),
      });
      await updateDoc(offerRef, {
        saves: increment(1),
      });
      setSaved(true);
    }
  };

  // 💬 WHATSAPP CLICK
  const handleWhatsapp = async () => {
    try {
      await updateDoc(doc(db, "offers", id), {
        whatsappClicks: increment(1),
      });
    } catch (err) {
      console.warn("WhatsApp click analytics failed:", err);
    }

    const text = encodeURIComponent(
      `${offer.title}\n\nView:\n${window.location.href}`
    );

    window.open(
      `https://wa.me/?text=${text}`,
      "_blank"
    );
  };

  // ⭐ REVIEW
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

  const isAdminUser =
    currentUser?.email === ADMIN_EMAIL;

  const isOwner =
    !!currentUser && !!offer && offer.sellerId === currentUser.uid;

  const canManage = isAdminUser || isOwner;

  const hasSubscription =
    currentUserData?.subscription?.active === true;

  // TEMPORARILY DISABLED: Allow all users to publish offers
  const canPublish =
    isAdminUser || isOwner; // || hasSubscription;

  const handlePublish = async () => {
    if (!canPublish) {
      alert("Active subscription required to publish this offer.");
      return;
    }

    const ref = doc(db, "offers", id);
    await updateDoc(ref, {
      isPublished: true,
      isActive: true,
    });

    setOffer((prev) =>
      prev
        ? { ...prev, isPublished: true, isActive: true }
        : prev
    );
  };

  const handleToggleActive = async (value) => {
    // Sellers need subscription to re‑enable; can always disable.
    if (!isAdminUser && !hasSubscription && value === true) {
      alert("Active subscription required to enable this offer.");
      return;
    }

    const ref = doc(db, "offers", id);
    await updateDoc(ref, {
      isActive: value,
    });

    setOffer((prev) =>
      prev ? { ...prev, isActive: value } : prev
    );
  };

  const handleDeleteOffer = async () => {
    if (!window.confirm("Delete this offer?")) return;

    await deleteDoc(doc(db, "offers", id));
    alert("Offer deleted.");
    navigate("/dashboard?tab=offers");
  };

  const handleEditOffer = () => {
    navigate(`/edit-offer/${id}`);
  };

  if (!offer) return <p>Loading...</p>;

  return (
    <div className="offer-details-container">
      <img
        src={offer.image || offer.imageUrl || ""}
        alt={offer.title}
        className="offer-main-img"
      />

      <div className="offer-details-box">
        <div className="offer-tabs">
          <button
            className={
              activeTab === "overview"
                ? "offer-tab-btn active"
                : "offer-tab-btn"
            }
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          {canManage && (
            <button
              className={
                activeTab === "manage"
                  ? "offer-tab-btn active"
                  : "offer-tab-btn"
              }
              onClick={() => setActiveTab("manage")}
            >
              Manage
            </button>
          )}
        </div>

        {activeTab === "overview" && (
          <>
            <h1>{offer.title}</h1>

            {offer.price && (
              <p className="price">₹ {offer.price}</p>
            )}
            <p>City: {offer.city}</p>

            {/* Business Profile Information */}
            {(offer.businessName || offer.businessAddress || offer.businessPhone) && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 16,
                marginTop: 16,
                marginBottom: 16
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: 16 }}>
                  🏪 Business Information
                </h3>
                {offer.businessName && (
                  <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                    {offer.businessName}
                  </p>
                )}
                {offer.businessAddress && (
                  <p style={{ margin: '4px 0', color: '#6b7280' }}>
                    📍 {offer.businessAddress}
                  </p>
                )}
                {offer.businessPhone && (
                  <p style={{ margin: '4px 0', color: '#6b7280' }}>
                    📞 {offer.businessPhone}
                  </p>
                )}
                {offer.businessCategory && (
                  <p style={{ margin: '4px 0', color: '#6b7280' }}>
                    🏷️ Category: {offer.businessCategory}
                  </p>
                )}
              </div>
            )}

            <p className="desc">{offer.description}</p>

            <div className="offer-actions">
              <button
                className="whatsapp-btn"
                onClick={handleWhatsapp}
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

            <div style={{ marginTop: 16 }}>
              <div className="analytics-row">
                Views: {offer.views || 0}
              </div>
              <div className="analytics-row">
                Saves: {offer.saves || 0}
              </div>
              <div className="analytics-row">
                WhatsApp clicks: {offer.whatsappClicks || 0}
              </div>
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
          </>
        )}

        {activeTab === "manage" && canManage && (
          <div className="manage-panel">
            <h2>Manage offer</h2>

            <div style={{ marginTop: 10 }}>
              <div className="analytics-row">
                Status:{" "}
                {offer.isPublished
                  ? offer.isActive
                    ? "Active"
                    : "Disabled"
                  : "Draft"}
              </div>
              <div className="analytics-row">
                Published: {offer.isPublished ? "Yes" : "No"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 18,
              }}
            >
              {!offer.isPublished && (
                <button
                  className="whatsapp-btn"
                  onClick={handlePublish}
                >
                  Publish offer
                </button>
              )}

              {offer.isPublished && (
                <button
                  className="save-btn"
                  onClick={() =>
                    handleToggleActive(!offer.isActive)
                  }
                >
                  {offer.isActive ? "Disable offer" : "Enable offer"}
                </button>
              )}

              <button
                className="save-btn"
                onClick={handleEditOffer}
              >
                Edit offer
              </button>

              <button
                className="whatsapp-btn"
                style={{ background: "#ef4444" }}
                onClick={handleDeleteOffer}
              >
                Delete offer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
