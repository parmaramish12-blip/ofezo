import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

import CitySelect from "../components/CitySelect";
import indiaCities from "../data/indiaCities";

import "../pages/Home.css";

const CITY_STORAGE_KEY = "ofezo_city";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [offers, setOffers] = useState([]);
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [sponsoredOffers, setSponsoredOffers] = useState([]);
  const [city, setCity] = useState(""); // Start with empty string
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [locationMessage, setLocationMessage] = useState("");
  const [savedOffers, setSavedOffers] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Categories for dropdown
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Mobile", label: "📱 Mobile" },
    { value: "Electronics", label: "� Electronics" },
    { value: "Furniture", label: "🪑 Furniture" },
    { value: "Clothing", label: "👕 Clothing" },
    { value: "Fashion", label: "👗 Fashion" },
    { value: "Grocery", label: "🛒 Grocery" },
    { value: "Restaurant", label: "🍽️ Restaurant" },
    { value: "Food & Dining", label: "🍔 Food & Dining" },
    { value: "Salon", label: "� Salon" },
    { value: "Gym", label: "� Gym" },
    { value: "Education", label: "📚 Education" },
    { value: "Medical", label: "🏥 Medical" },
    { value: "Health & Beauty", label: "💄 Health & Beauty" },
    { value: "Automobile", label: "🚗 Automobile" },
    { value: "Vehicles", label: "� Vehicles" },
    { value: "Real Estate", label: "🏠 Real Estate" },
    { value: "Home & Garden", label: "� Home & Garden" },
    { value: "Services", label: "🔧 Services" },
    { value: "Jobs", label: "� Jobs" },
    { value: "Mobile Phones", label: "📱 Mobile Phones" },
    { value: "Books", label: "📖 Books" },
    { value: "Sports", label: "⚽ Sports" },
    { value: "Travel", label: "✈️ Travel" }
  ];

  /* ---------------- PENDING CHANGES MANAGEMENT ---------------- */

  const addPendingChange = (type, description) => {
    setPendingChanges(prev => [...prev, { 
      id: Date.now(), 
      type, 
      description, 
      timestamp: new Date() 
    }]);
  };

  const removePendingChange = (id) => {
    setPendingChanges(prev => prev.filter(change => change.id !== id));
  };

  const handleBuildChanges = async () => {
    if (pendingChanges.length === 0) {
      alert("No pending changes to build");
      return;
    }

    try {
      console.log("Building changes:", pendingChanges);
      
      // TODO: Implement actual build logic
      // This could involve:
      // - Creating deployment bundle
      // - Uploading to server
      // - Sending notifications
      
      alert(`Successfully built ${pendingChanges.length} changes!`);
      
      // Clear pending changes after successful build
      setPendingChanges([]);
    } catch (error) {
      console.error("Build error:", error);
      alert("Failed to build changes");
    }
  };

  /* ---------------- SAVE OFFER FUNCTIONALITY ---------------- */

  const loadSavedOffers = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const savedRef = collection(db, "users", currentUser.uid, "savedOffers");
      const snap = await getDocs(savedRef);
      const savedIds = snap.docs.map(doc => doc.data().offerId);
      setSavedOffers(savedIds);
    } catch (err) {
      console.error("Load saved offers error:", err);
    }
  }, [currentUser]);

  /* ---------------- AUTO DETECT LOCATION ---------------- */

  const detectUserLocation = async () => {
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

      const finalCity = detectedCity || "Vadodara"; // Default: Vadodara

      setCity(finalCity);
      window.localStorage.setItem(CITY_STORAGE_KEY, finalCity);
      setLocationMessage(`Showing offers in ${finalCity}`);
      await loadCityOffers(finalCity);
    } finally {
      setDetectingLocation(false);
    }
  };

  /* ---------------- LOAD FEATURED OFFERS ---------------- */
  const loadFeaturedOffers = async () => {
    try {
      const q = query(
        collection(db, "offers"),
        where("isFeatured", "==", true),
        where("status", "==", "published"),
        where("isActive", "==", true)
      );
      const snap = await getDocs(q);
      
      console.log("Featured offers query result:", snap.docs.length, snap.docs);
      
      const today = new Date();
      const list = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data()
        }))
        .filter((o) => {
          if (o.adminDisabled === true) return false;
          if (!o.expiryDate) return true;
          const exp = typeof o.expiryDate.toDate === "function" ? o.expiryDate.toDate() : new Date(o.expiryDate);
          return exp >= today;
        });
      
      console.log("Featured offers after filtering:", list);
      setFeaturedOffers(list);
    } catch (err) {
      console.error("Error loading featured offers:", err);
      setFeaturedOffers([]);
    }
  };

  /* ---------------- LOAD SPONSORED OFFERS ---------------- */
  const loadSponsoredOffers = async () => {
    try {
      const q = query(
        collection(db, "offers"),
        where("isSponsored", "==", true),
        where("status", "==", "published"),
        where("isActive", "==", true)
      );
      const snap = await getDocs(q);
      
      console.log("Sponsored offers query result:", snap.docs.length, snap.docs);
      
      const today = new Date();
      const list = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data()
        }))
        .filter((o) => {
          if (o.adminDisabled === true) return false;
          if (!o.expiryDate) return true;
          const exp = typeof o.expiryDate.toDate === "function" ? o.expiryDate.toDate() : new Date(o.expiryDate);
          return exp >= today;
        });
      
      console.log("Sponsored offers after filtering:", list);
      setSponsoredOffers(list);
    } catch (err) {
      console.error("Error loading sponsored offers:", err);
      setSponsoredOffers([]);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    detectUserLocation();
    loadFeaturedOffers();
    loadSponsoredOffers();
    
    // TEMPORARY: Add test data for featured and sponsored offers
    setTimeout(() => {
      const testFeatured = [
        {
          id: 'test-featured-1',
          title: 'Test Featured Offer - iPhone 13',
          city: 'Vadodara',
          category: 'Electronics',
          price: '999',
          image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=iPhone+13',
          isFeatured: true,
          status: 'published',
          isActive: true,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      ];
      
      const testSponsored = [
        {
          id: 'test-sponsored-1',
          title: 'Test Sponsored Offer - Fashion Bag',
          city: 'Vadodara',
          category: 'Fashion',
          price: '599',
          image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Fashion+Bag',
          isSponsored: true,
          status: 'published',
          isActive: true,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      ];
      
      console.log("Setting test featured offers:", testFeatured);
      console.log("Setting test sponsored offers:", testSponsored);
      
      setFeaturedOffers(testFeatured);
      setSponsoredOffers(testSponsored);
    }, 2000); // 2 seconds delay
    
    // eslint-disable-next-line
  }, []);

  /* ---------------- USER PROFILE MANAGEMENT ---------------- */

  const createUserProfile = useCallback(async () => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user profile document
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email,
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
          role: "user"
        });
        console.log("User profile created for:", currentUser.email);
        
        // Only add to pending changes if it's available
        if (setPendingChanges) {
          setPendingChanges(prev => [...prev, { 
            id: Date.now(), 
            type: "PROFILE", 
            description: "Created new user profile", 
            timestamp: new Date() 
          }]);
        }
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: new Date()
        });
        console.log("User last login updated for:", currentUser.email);
      }
    } catch (err) {
      console.error("Error creating user profile:", err);
      // Don't let profile creation error block the app
    }
  }, [currentUser]);

  useEffect(() => {
    // Load saved offers when user changes
    if (currentUser) {
      // Run these in parallel to avoid blocking
      loadSavedOffers().catch(err => {
        console.error("Error loading saved offers:", err);
      });
      
      // Create user profile document if it doesn't exist
      createUserProfile().catch(err => {
        console.error("Error in user profile creation:", err);
      });
    } else {
      setSavedOffers([]);
    }
  }, [currentUser, loadSavedOffers]);

  const buildOffersQuery = (cityValue, searchValue) => {
    const conditions = [
      where("status", "==", "published"), // Only show published offers
      where("isActive", "==", true)
    ];

    // Always filter by city (default: Vadodara)
    if (cityValue || "Vadodara") {
      conditions.push(where("city", "==", cityValue || "Vadodara"));
    }

    return query(collection(db, "offers"), ...conditions);
  };

  const loadCityOffers = async (cityValue) => {
    const effectiveCity = cityValue || city || "Vadodara"; // Default: Vadodara
    if (!effectiveCity) return;

    try {
      setLoading(true);

      const q = buildOffersQuery(effectiveCity, null);
      const snap = await getDocs(q);
      
      console.log("Regular offers query result:", snap.docs.length, snap.docs);

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

      console.log("Regular offers after filtering:", list);
      setOffers(list);
      
      // Load saved offers if user is logged in
      if (currentUser) {
        await loadSavedOffers();
      }
    } catch (err) {
      console.error("Home load error:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveOffer = async (offerId) => {
    if (!currentUser) {
      alert("Please login to save offers");
      return;
    }

    try {
      const savedRef = collection(db, "users", currentUser.uid, "savedOffers");
      await addDoc(savedRef, {
        offerId,
        savedAt: new Date()
      });
      
      setSavedOffers(prev => [...prev, offerId]);
      alert("Offer saved successfully!");
    } catch (err) {
      console.error("Save offer error:", err);
      alert("Failed to save offer");
    }
  };

  const unsaveOffer = async (offerId) => {
    if (!currentUser) return;

    try {
      const savedRef = collection(db, "users", currentUser.uid, "savedOffers");
      const q = query(savedRef, where("offerId", "==", offerId));
      const snap = await getDocs(q);
      
      for (const doc of snap.docs) {
        await deleteDoc(doc.ref);
      }
      
      setSavedOffers(prev => prev.filter(id => id !== offerId));
      alert("Offer removed from saved");
    } catch (err) {
      console.error("Unsave offer error:", err);
      alert("Failed to remove offer");
    }
  };

  const toggleSaveOffer = async (offerId, e) => {
    e.stopPropagation(); // Prevent navigation to offer details
    
    if (savedOffers.includes(offerId)) {
      await unsaveOffer(offerId);
    } else {
      await saveOffer(offerId);
    }
  };

  
  /* ---------------- SEARCH (CITY OR CATEGORY OR BOTH) ---------------- */

  const searchOffers = async () => {
    console.log("Search clicked - City:", city, "Category/Search:", category);
    
    try {
      setLoading(true);

      let q;
      
      if (city && category) {
        // Both city and category - filter by city first, then by category
        q = query(
          collection(db, "offers"),
          where("status", "==", "published"),
          where("isActive", "==", true),
          where("city", "==", city)
        );
      } else if (city) {
        // Only city - filter by city
        q = query(
          collection(db, "offers"),
          where("status", "==", "published"),
          where("isActive", "==", true),
          where("city", "==", city)
        );
      } else if (category) {
        // Only category - get all active offers
        q = query(
          collection(db, "offers"),
          where("status", "==", "published"),
          where("isActive", "==", true)
        );
      } else {
        // No filters - load default city offers
        console.log("No filters, loading default city offers");
        await loadCityOffers("Vadodara");
        return;
      }

      console.log("Query built:", q);
      const snap = await getDocs(q);
      console.log("Query result:", snap.docs.length, "documents");

      const today = new Date();
      let list = snap.docs
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

      console.log("After basic filtering:", list.length, "offers");

      // Filter by search text if provided (and not just city search)
      if (category && category.trim()) {
        const searchText = category.toLowerCase().trim();
        console.log("Filtering by search text:", searchText);
        list = list.filter((offer) => {
          return (
            (offer.title && offer.title.toLowerCase().includes(searchText)) ||
            (offer.description && offer.description.toLowerCase().includes(searchText)) ||
            (offer.category && offer.category.toLowerCase().includes(searchText)) ||
            (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(searchText)))
          );
        });
        console.log("After search filtering:", list.length, "offers");
      }

      setOffers(list);
      
      // Load saved offers if user is logged in
      if (currentUser) {
        await loadSavedOffers();
      }
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
      
      {/* PENDING CHANGES */}
      {currentUser && pendingChanges.length > 0 && (
        <div className="pending-changes">
          <div className="pending-header">
            <h3>📝 Pending Changes ({pendingChanges.length})</h3>
            <button 
              className="build-btn"
              onClick={handleBuildChanges}
            >
              🔨 Build
            </button>
          </div>
          <div className="pending-list">
            {pendingChanges.map((change) => (
              <div key={change.id} className="pending-item">
                <span className="change-type">{change.type}</span>
                <span className="change-desc">{change.description}</span>
                <button 
                  className="remove-change-btn"
                  onClick={() => removePendingChange(change.id)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* HERO + SEARCH */}
      <div className="search-box">
        <h1>Discover best local offers</h1>
        <p>
          Smart deals from nearby sellers — tailored to your city and
          interests.
        </p>

            <div className="search-bar">
          <div className="location-input">
            <span className="location-icon">📍</span>
            <CitySelect
              value={city}
              onChange={(val) => {
                setCity(val);
                searchOffers();
              }}
              placeholder="Select city..."
            />
          </div>

          <div className="category-input">
            <span className="category-icon">🏷️</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value);
                setCategory(value);
                searchOffers();
              }}
              className="category-dropdown"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

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

      {/* FEATURED OFFERS SECTION */}
      {featuredOffers.length > 0 && (
        <div className="offers-section">
          <div className="offers-header-row">
            <div>
              <h2>⭐ Featured Offers</h2>
              <p className="offers-subtitle">
                Hand-picked deals from verified sellers
              </p>
            </div>
          </div>

          <div className="offers-grid">
            {featuredOffers.map((o) => (
              <div
                key={o.id}
                className="offer-card featured"
                onClick={() => navigate(`/offer/${o.id}`)}
                style={{ border: '2px solid #fbbf24' }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: '#fbbf24', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  ⭐ Featured
                </div>
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
                  {currentUser && (
                    <button
                      className={`save-btn ${savedOffers.includes(o.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSaveOffer(o.id, e)}
                      style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: savedOffers.includes(o.id) ? '#22c55e' : '#fff',
                        color: savedOffers.includes(o.id) ? '#fff' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      {savedOffers.includes(o.id) ? '✓ Saved' : 'Save Offer'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPONSORED OFFERS SECTION */}
      {sponsoredOffers.length > 0 && (
        <div className="offers-section">
          <div className="offers-header-row">
            <div>
              <h2>🎯 Sponsored Offers</h2>
              <p className="offers-subtitle">
                Promoted deals from premium sellers
              </p>
            </div>
          </div>

          <div className="offers-grid">
            {sponsoredOffers.map((o) => (
              <div
                key={o.id}
                className="offer-card sponsored"
                onClick={() => navigate(`/offer/${o.id}`)}
                style={{ border: '2px solid #10b981' }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: '#10b981', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  🎯 Sponsored
                </div>
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
                  {currentUser && (
                    <button
                      className={`save-btn ${savedOffers.includes(o.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSaveOffer(o.id, e)}
                      style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: savedOffers.includes(o.id) ? '#22c55e' : '#fff',
                        color: savedOffers.includes(o.id) ? '#fff' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      {savedOffers.includes(o.id) ? '✓ Saved' : 'Save Offer'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

        {loading && (
          <div className="offers-section">
            <div className="offers-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="offer-card skeleton">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && offers.length === 0 && (
          <div className="no-offers-message">
            <div className="no-offers-icon">🔍</div>
            <h3>No offers found</h3>
            <p>We will get offers soon for you!</p>
            <div className="no-offers-buttons">
              <button 
                className="notify-btn"
                onClick={() => {
                  // TODO: Implement notify me functionality
                  alert("Notify me feature coming soon!");
                }}
              >
                🔔 Notify Me
              </button>
              <button 
                className="back-btn"
                onClick={() => {
                  setCategory("");
                  loadCityOffers(city || "Vadodara");
                }}
              >
                ↩️ Back to All Offers
              </button>
            </div>
          </div>
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
                  {currentUser && (
                    <button
                      className={`save-btn ${savedOffers.includes(o.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSaveOffer(o.id, e)}
                      style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: savedOffers.includes(o.id) ? '#22c55e' : '#fff',
                        color: savedOffers.includes(o.id) ? '#fff' : '#333',
                        cursor: 'pointer'
                      }}
                    >
                      {savedOffers.includes(o.id) ? '✓ Saved' : 'Save Offer'}
                    </button>
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
