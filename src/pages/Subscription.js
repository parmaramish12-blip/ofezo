import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "../styles/subscription.css";

export default function Subscription() {
  const { currentUserData } = useAuth();

  const subscription = currentUserData?.subscription;

  const isActive =
    subscription?.isActive &&
    subscription?.endDate >=
      new Date().toISOString().split("T")[0];

  const buyPlan = async (plan, amount) => {
    const createOrder = httpsCallable(functions, "createOrder");

    const res = await createOrder({ amount });

    const options = {
      key: "RAZORPAY_KEY_ID",
      amount: res.data.amount,
      currency: "INR",
      name: "OFEZO",
      description: plan + " Plan",
      order_id: res.data.id,
      handler: async () => {
        const verify = httpsCallable(functions, "verifyPayment");
        await verify({ plan });

        alert("Payment successful");
        window.location.reload();
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="subscription-page">

      <h2 className="sub-title">Choose Your Subscription</h2>
      <p className="sub-subtitle">
        Activate plan to publish and manage offers
      </p>

      {isActive && (
        <div className="active-box">
          ✅ Your subscription is active till{" "}
          <b>{subscription.endDate}</b>
        </div>
      )}

      <div className="plans-wrapper">

        {/* BASIC PLAN */}
        <div className="plan-card">
          <h3>Basic Plan</h3>
          <p className="price">₹499 / month</p>

          <ul>
            <li>✔ Unlimited offers</li>
            <li>✔ Edit / delete offers</li>
            <li>✔ WhatsApp sharing</li>
            <li>✔ Dashboard access</li>
          </ul>

          <button
            className="plan-btn"
            onClick={() => buyPlan("BASIC", 499)}
          >
            Buy Basic
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="plan-card popular">
          <span className="badge">POPULAR</span>

          <h3>Pro Plan</h3>
          <p className="price">₹999 / month</p>

          <ul>
            <li>✔ Everything in Basic</li>
            <li>✔ Featured offers</li>
            <li>✔ Priority listing</li>
            <li>✔ Analytics access</li>
          </ul>

          <button
            className="plan-btn primary"
            onClick={() => buyPlan("PRO", 999)}
          >
            Buy Pro
          </button>
        </div>

      </div>
    </div>
  );
}
