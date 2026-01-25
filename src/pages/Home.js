import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [offers, setOffers] = useState([]);
  const [city, setCity] = useState("Vadodara");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const loadOffers = async () => {
    const snap = await getDocs(collection(db, "offers"));
    const today = new Date();

    const list = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (o) =>
          o.isActive === true &&
          (!o.expiryDate || new Date(o.expiryDate) >= today)
      );

    setOffers(list);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const filtered = offers.filter(
    (o) =>
      (city ? o.city === city : true) &&
      (category ? o.category === category : true)
  );

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <h1>Discover Best Local Offers</h1>
        <p>Search deals near your city</p>

        <div className="search-box">
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option>Vadodara</option>
            <option>Anand</option>
            <option>Ahmedabad</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option>Food</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Fashion</option>
          </select>

          <button>Search</button>
        </div>
      </section>

      {/* OFFERS */}
      <section className="offers-section">
        <h2>Nearby Offers</h2>

        <div className="offer-grid">
          {filtered.map((o) => (
            <div
              key={o.id}
              className="offer-card"
              onClick={() => navigate(`/offer/${o.id}`)}
            >
              <h3>{o.title}</h3>
              <p className="shop">🏪 {o.shopName || "Local Shop"}</p>
              <p className="city">{o.city}</p>
              <strong>₹ {o.price}</strong>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
