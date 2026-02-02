import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Profile from "./Profile";
import MyOffers from "./MyOffers";
import SavedOffers from "./SavedOffers";
import Subscription from "./Subscription";

export default function Dashboard() {
  const { currentUser, currentUserData, loading } = useAuth();
  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "profile";

  if (loading || !currentUser || !currentUserData) {
    return (
      <div style={{ padding: 40 }}>
        <h3>Loading your account…</h3>
      </div>
    );
  }

  switch (tab) {
    case "offers":
      return <MyOffers />;
    case "saved":
      return <SavedOffers />;
    case "subscription":
      return <Subscription />;
    case "profile":
    default:
      return <Profile />;
  }
}
