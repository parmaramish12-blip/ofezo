import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "sellers", id));
      if (snap.exists()) {
        setSeller(snap.data());
      }
    };
    load();
  }, [id]);

  if (!seller) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>{seller.shopName}</h2>
      <p>{seller.address}</p>
      <p>📞 {seller.mobile}</p>
      <p>🕒 {seller.timing}</p>
    </div>
  );
}
