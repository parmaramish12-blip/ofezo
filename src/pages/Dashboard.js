import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Profile from "./Profile";
import Business from "./Business";
import MyOffers from "./MyOffers";
import SavedOffers from "./SavedOffers";
import Subscription from "./Subscription";

import "../styles/dashboard.css";

export default function Dashboard() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { currentUserData } = useAuth();

  const tab = params.get("tab") || "profile";

  const hasBusiness =
    currentUserData?.businessProfile?.businessName;

  return (
    <div className="dashboard-container">

      {tab === "profile" && <Profile />}

      {tab === "business" && <Business />}

      {tab === "offers" && (
        <>
          {!hasBusiness ? (
            <div className="blocked-card">
              <h2>Complete Business Profile</h2>
              <p>
                Please add your business details before posting offers.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/dashboard?tab=business")
                }
              >
                Add Business Details
              </button>
            </div>
          ) : (
            <MyOffers />
          )}
        </>
      )}

      {tab === "saved" && <SavedOffers />}

      {tab === "subscription" && <Subscription />}

    </div>
  );
}
