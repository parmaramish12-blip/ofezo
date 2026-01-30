import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import SearchBar from "../components/SearchBar";
import "../pages/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  // 🔒 FINAL SAFE FILTER
  // Only PUBLISHED + ACTIVE + NOT EXPIRED
  const filterOffers = (list) => {
    const today = new Date().toISOString().split("T")[0];

    return list.filter(
      (o) =>
        o.isPublished === true &&
        o.isActive === true &&
        o.expiryDate &&
        o.expiryDate >= today
    );
  };

  const fetchOffers = async (
    selectedCity = "",
    selectedCategory = ""
  ) => {
    try {
      setLoading(true);

      let ref = collection(db, "offers");
      const conditions = [];

      if (selectedCity) {
        conditions.push(where("city", "==", selectedCity));
      }

      if (selectedCategory) {
        conditions.push(
          where("category", "==", selectedCategory)
        );
      }

      const q =
        conditions.length > 0
          ? query(ref, ...conditions)
          : ref;

      const snapshot = await getDocs(q);

      const rawData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ APPLY FINAL VISIBILITY RULE
      const safeData = filterOffers(rawData);

      setOffers(safeData);
    } catch (error) {
      console.error("Error loading offers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="home-container">

      {/* 🔍 SEARCH BAR */}
      <SearchBar
        city={city}
        setCity={setCity}
        category={category}
        setCategory={setCategory}
        onSearch={() => fetchOffers(city, category)}
      />

      <h2 className="home-title">Latest Offers</h2>

      {loading && <p>Loading offers...</p>}

      {!loading && offers.length === 0 && (
        <p>No active offers found</p>
      )}

      <div className="offers-grid">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="offer-card"
            onClick={() =>
              navigate(`/offer/${offer.id}`)
            }
            style={{ cursor: "pointer" }}
          >
            <img
              src={offer.image}
              alt={offer.title}
              className="offer-img"
            />

            <div className="offer-body">
              <h3>{offer.title}</h3>

              <p className="offer-desc">
                {offer.description}
              </p>

              <p>
                <strong>City:</strong> {offer.city}
              </p>

              <p>
                <strong>Price:</strong> ₹{offer.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
