import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { isSubscriptionActive } from "../utils/subscription";
import "../styles/addOffer.css";

export default function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUserData } = useAuth();

  const hasSubscription = isSubscriptionActive(
    currentUserData?.subscription
  );

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!hasSubscription) {
      navigate("/dashboard?tab=subscription");
      return;
    }

    const load = async () => {
      const snap = await getDoc(doc(db, "offers", id));

      if (!snap.exists()) {
        navigate("/dashboard");
        return;
      }

      const data = snap.data();

      if (data.sellerId !== auth.currentUser.uid) {
        navigate("/dashboard");
        return;
      }

      setForm(data);
      setLoading(false);
    };

    load();
  }, [id, hasSubscription, navigate]);

  const updateOffer = async () => {
    await updateDoc(doc(db, "offers", id), {
      ...form,
      updatedAt: serverTimestamp(),
    });

    alert("Offer updated");
    navigate("/dashboard?tab=offers");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="offer-form">
      <h2>Edit Offer</h2>

      <input name="title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/>
      <input name="image" value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})}/>
      <input name="price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
      <input name="city" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}/>
      <input name="category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}/>
      <textarea name="description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/>
      <input type="date" name="expiryDate" value={form.expiryDate} onChange={(e)=>setForm({...form,expiryDate:e.target.value})}/>

      <button onClick={updateOffer}>Update Offer</button>
    </div>
  );
}
