import { useAuth } from "../context/AuthContext";

export default function MyOffers() {
  const { currentUserData } = useAuth();

  if (!currentUserData?.business?.isCompleted) {
    return <h3>Please complete Business Profile first</h3>;
  }

  return <h2>My Offers page (next step)</h2>;
}
