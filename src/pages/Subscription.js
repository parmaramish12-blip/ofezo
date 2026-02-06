import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/subscription.css";

export default function Subscription() {
  const { currentUser, currentUserData } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const subscription = currentUserData?.subscription;
  const isActive =
    subscription?.active === true &&
    subscription?.endDate?.toDate() > new Date();

  // Pricing table data
  const pricingPlans = [
    {
      id: "basic",
      name: "Basic",
      price: "₹499",
      period: "per month",
      features: [
        "Up to 5 offers per month",
        "Basic visibility",
        "Standard support",
        "7-day listing duration",
        "Basic analytics"
      ],
      popular: false,
      color: "#6b7280"
    },
    {
      id: "featured",
      name: "Featured",
      price: "₹999",
      period: "per month",
      features: [
        "Up to 15 offers per month",
        "Featured placement",
        "Priority support",
        "14-day listing duration",
        "Advanced analytics",
        "Social media promotion"
      ],
      popular: true,
      color: "#2563eb"
    },
    {
      id: "business",
      name: "Business",
      price: "₹1,999",
      period: "per month",
      features: [
        "Unlimited offers",
        "Premium placement",
        "24/7 dedicated support",
        "30-day listing duration",
        "Real-time analytics",
        "Multi-channel promotion",
        "Custom branding"
      ],
      popular: false,
      color: "#10b981"
    }
  ];

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

  const handleSubscribe = async (planId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Update user's subscription in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        subscriptionType: planId,
        subscription: {
          active: true,
          plan: planId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        updatedAt: new Date()
      });

      // Redirect to Add Offer page
      navigate("/add-offer");
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-page">
      <h2 className="sub-title">Choose Your Plan</h2>
      <p className="sub-desc">
        Select the perfect plan for your business needs
      </p>

      {/* PRICING CARDS */}
      <div className="plans">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.popular ? "popular" : ""}`}
            style={{ borderColor: plan.popular ? plan.color : "transparent" }}
          >
            {plan.popular && (
              <div className="badge" style={{ background: plan.color }}>
                Most Popular
              </div>
            )}
            
            <h3 style={{ color: plan.color }}>{plan.name}</h3>
            <div className="price">
              {plan.price}
              <span className="period">{plan.period}</span>
            </div>
            
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="checkmark">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={`plan-btn ${plan.popular ? "primary" : ""}`}
              style={{
                background: plan.popular ? plan.color : "#374151",
                color: "white"
              }}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* CURRENT SUBSCRIPTION STATUS */}
      <h3>Current Subscription</h3>
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

      {/* PAYMENT HISTORY */}
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
