import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import SearchBar from "../components/SearchBar";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "offers"), (snap) => {
      setOffers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = offers.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 40 }}>
      <SearchBar value={search} setValue={setSearch} />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {filtered.map(o => (
          <div key={o.id} style={card}>
            <h3>{o.title}</h3>
            <p>{o.city}</p>
            <b>{o.price}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

const card = {
  width: 260,
  padding: 20,
  borderRadius: 10,
  background: "#fff",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
};
