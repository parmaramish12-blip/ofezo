import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";

import CitySelect from "../components/CitySelect";
import CategorySelect from "../components/CategorySelect";
import indiaCities from "../data/indiaCities";

import "../pages/Home.css";

const CITY_STORAGE_KEY = "ofezo_city";

export default function Home() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [locationMessage, setLocationMessage] = useState("");

  /* ---------------- AUTO-SELECT CITY ON FIRST LOAD ---------------- */

  useEffect(() => {
    initLocation();
    // eslint-disable-next-line
  }, []);

  const initLocation = async () => {
    if (typeof window === "undefined") return;

    try {
      // 1) Use saved city if present
      const saved = window.localStorage.getItem(CITY_STORAGE_KEY);
      if (saved) {
        setCity(saved);
        setLocationMessage(`Showing offers in ${saved}`);
        await loadCityOffers(saved);
        setDetectingLocation(false);
        return;
      }

      // 2) Try IP-based city lookup (best-effort)
      setDetectingLocation(true);
      let detectedCity = null;

      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (data?.city) {
            const rawCity = String(data.city).trim();
            const match = indiaCities.find(
              (c) =>
                c.city.toLowerCase() ===
                rawCity.toLowerCase()
            );
            detectedCity = match ? match.city : rawCity;
          }
        }
      } catch {
        // ignore IP errors, we'll fallback
      }

      const finalCity = detectedCity || "Vadodara";

      setCity(finalCity);
      window.localStorage.setItem(CITY_STORAGE_KEY, finalCity);
      setLocationMessage(`Showing offers in ${finalCity}`);
      await loadCityOffers(finalCity);
    } finally {
      setDetectingLocation(false);
    }
  };

  const buildOffersQuery = (cityValue, categoryValue) => {
    const conditions = [
      where("isPublished", "==", true),
      where("isActive", "==", true)
    ];

    if (cityValue) {
      conditions.push(where("city", "==", cityValue));
    }

    if (categoryValue) {
      conditions.push(where("category", "==", categoryValue));
    }

    return query(collection(db, "offers"), ...conditions);
  };

  const loadCityOffers = async (cityValue) => {
    const effectiveCity = cityValue || city;
    if (!effectiveCity) return;

    try {
      setLoading(true);

      const q = buildOffersQuery(effectiveCity, null);
      const snap = await getDocs(q);

      const today = new Date();
      const list = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data()
        }))
        .filter((o) => {
          // respect adminDisabled if field exists
          if (o.adminDisabled === true) return false;

          // filter expired offers safely even if expiryDate missing
          if (!o.expiryDate) return true;

          const exp =
            typeof o.expiryDate.toDate === "function"
              ? o.expiryDate.toDate()
              : new Date(o.expiryDate);

          return exp >= today;
        });

      setOffers(list);
    } catch (err) {
      console.error("Home load error:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEARCH (CITY OR CATEGORY OR BOTH) ---------------- */

  const searchOffers = async () => {
    if (!city && !category) return;

    try {
      setLoading(true);

      const q = buildOffersQuery(city, category);
      const snap = await getDocs(q);

      const today = new Date();
      const list = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data()
        }))
        .filter((o) => {
          if (o.adminDisabled === true) return false;

          if (!o.expiryDate) return true;

          const exp =
            typeof o.expiryDate.toDate === "function"
              ? o.expiryDate.toDate()
              : new Date(o.expiryDate);

          return exp >= today;
        });

      setOffers(list);
    } catch (err) {
      console.error("Search error:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="home-wrapper">
      {/* HERO + SEARCH */}
      <div className="search-box">
        <h1>Discover the best local offers</h1>
        <p>
          Smart deals from nearby sellers — tailored to your city and
          interests.
        </p>

        <div className="search-bar">
          <CitySelect
            value={city}
            onChange={(val) => {
              setCity(val);
              if (typeof window !== "undefined") {
                window.localStorage.setItem(
                  CITY_STORAGE_KEY,
                  val
                );
              }
              setLocationMessage(`Showing offers in ${val}`);
              loadCityOffers(val);
            }}
          />

          <CategorySelect
            value={category}
            onChange={(val) => setCategory(val)}
          />

          <button onClick={searchOffers}>
            Search
          </button>
        </div>

        {detectingLocation && (
          <p className="location-hint">
            Detecting your city…
          </p>
        )}
        {!detectingLocation && locationMessage && (
          <p className="location-hint">
            {locationMessage} &nbsp;·&nbsp; You can change city
            anytime.
          </p>
        )}
      </div>

      {/* OFFERS */}
      <div className="offers-section">
        <div className="offers-header-row">
          <div>
            <h2>
              {city
                ? `Offers in ${city}`
                : "Latest active offers"}
            </h2>
            <p className="offers-subtitle">
              Only live, approved offers that haven&apos;t
              expired yet.
            </p>
          </div>
        </div>

        {loading && <p>Loading offers...</p>}

        {!loading && offers.length === 0 && (
          <p>No offers found for this filter.</p>
        )}

        {!loading && offers.length > 0 && (
          <div className="offers-grid">
            {offers.map((o) => (
              <div
                key={o.id}
                className="offer-card"
                onClick={() => navigate(`/offer/${o.id}`)}
              >
                <img
                  src={o.image || o.imageUrl || ""}
                  alt={o.title}
                />
                <div className="offer-info">
                  <h3>{o.title}</h3>
                  <p>
                    {o.city} • {o.category}
                  </p>
                  {o.price && (
                    <strong>₹ {o.price}</strong>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
