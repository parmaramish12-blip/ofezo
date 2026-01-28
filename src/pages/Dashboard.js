import { useSearchParams } from "react-router-dom";
import Profile from "./Profile";
import Business from "./Business";
import MyOffers from "./MyOffers";

export default function Dashboard() {
  const [params] = useSearchParams();
  const tab = params.get("tab") || "profile";

  return (
    <div style={{ padding: 30 }}>
      {tab === "profile" && <Profile />}
      {tab === "business" && <Business />}
      {tab === "offers" && <MyOffers />}
    </div>
  );
}
