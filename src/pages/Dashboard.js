import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  const loadOffers = async () => {
    const q = query(
      collection(db, "offers"),
      where("sellerId", "==", auth.currentUser.uid)
    );

    const snap = await getDocs(q);
    const list = [];

    snap.forEach((docu) => {
      const data = docu.data();

      // expiry auto check
      const expired =
        data.expiryDate &&
        new Date(data.expiryDate) < new Date();

      list.push({
        id: docu.id,
        ...data,
        expired,
      });
    });

    setOffers(list);
  };

  useEffect(() => {
    loadOffers();
    // eslint-disable-next-line
  }, []);

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    await deleteDoc(doc(db, "offers", id));
    loadOffers();
  };

  const toggleStatus = async (id, current) => {
    await updateDoc(doc(db, "offers", id), {
      isActive: !current,
    });
    loadOffers();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Seller Dashboard</h2>
        <button onClick={() => navigate("/add-offer")}>+ Add Offer</button>
      </div>

      <div className="offer-grid">
        {offers.map((o) => (
          <div key={o.id} className="offer-card">

            <h3>{o.title}</h3>
            <p>{o.city} • {o.category}</p>
            <p className="price">₹ {o.price}</p>

            {o.expired ? (
              <span className="expired">Expired</span>
            ) : o.isActive ? (
              <span className="active">Active</span>
            ) : (
              <span className="inactive">Inactive</span>
            )}

            <div className="card-actions">
              {!o.expired && (
                <button
                  className="toggle"
                  onClick={() => toggleStatus(o.id, o.isActive)}
                >
                  {o.isActive ? "Deactivate" : "Activate"}
                </button>
              )}

              <button
                className="edit"
                onClick={() => navigate(`/edit-offer/${o.id}`)}
              >
                Edit
              </button>

              <button
                className="delete"
                onClick={() => deleteOffer(o.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
