import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import SearchBar from "../components/SearchBar";
import "./Home.css";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const fetchOffers = async (selectedCity = "", selectedCategory = "") => {
    try {
      let q = collection(db, "offers");

      const conditions = [];

      if (selectedCity) {
        conditions.push(where("city", "==", selectedCity));
      }

      if (selectedCategory) {
        conditions.push(where("category", "==", selectedCategory));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOffers(data);
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
      {/* SEARCH BAR */}
      <SearchBar
        city={city}
        setCity={setCity}
        category={category}
        setCategory={setCategory}
        onSearch={() => fetchOffers(city, category)}
      />

      <h2>Latest Offers</h2>

      {loading && <p>Loading offers...</p>}

      {!loading && offers.length === 0 && (
        <p>No offers found</p>
      )}

      <div className="offers-grid">
        {offers.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <h3>{offer.title || "Special Offer"}</h3>
            <p>{offer.description}</p>

            <p>
              <strong>Category:</strong> {offer.category}
            </p>

            <p>
              <strong>City:</strong> {offer.city}
            </p>

            <p>
              <strong>Price:</strong> ₹{offer.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
