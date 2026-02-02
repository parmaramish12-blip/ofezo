import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "payments"));
      setPayments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    load();
  }, []);

  return (
    <div>
      <h2>Payments</h2>

      {payments.length === 0 && (
        <p>No payments found</p>
      )}

      {payments.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <h4>{p.userName}</h4>
          <p>Plan: {p.plan}</p>
          <p>Amount: ₹{p.amount}</p>
          <p>Status: {p.status}</p>
          <p>
            Date:{" "}
            {p.createdAt?.toDate().toDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
