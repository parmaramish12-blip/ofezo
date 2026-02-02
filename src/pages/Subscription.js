import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/subscription.css";

export default function Subscription() {
  const { currentUser, currentUserData } = useAuth();

  const [history, setHistory] = useState([]);

  const subscription = currentUserData?.subscription;

  const isActive =
    subscription?.active === true &&
    subscription?.endDate?.toDate() > new Date();

  useEffect(() => {
    if (!currentUser) return;

    const loadHistory = async () => {
      const q = query(
        collection(db, "payments"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      setHistory(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    loadHistory();
  }, [currentUser]);

  return (
    <div className="subscription-page">
      <h2 className="sub-title">My Subscription</h2>

      {/* ACTIVE STATUS */}
      {isActive ? (
        <div className="active-box">
          ✅ Active till{" "}
          <b>
            {subscription.endDate
              .toDate()
              .toDateString()}
          </b>
        </div>
      ) : (
        <div className="inactive-box">
          ❌ No active subscription
        </div>
      )}

      <hr />

      {/* HISTORY */}
      <h3>Payment History</h3>

      {history.length === 0 && (
        <p>No payments found</p>
      )}

      {history.map((p) => (
        <div key={p.id} className="payment-row">
          <div>
            <b>{p.plan}</b> Plan
          </div>

          <div>₹{p.amount}</div>

          <div>
            {p.createdAt
              ?.toDate()
              .toDateString()}
          </div>

          <div
            className={
              p.status === "success"
                ? "paid"
                : "failed"
            }
          >
            {p.status}
          </div>
        </div>
      ))}
    </div>
  );
}
