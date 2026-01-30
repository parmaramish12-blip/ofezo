import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;

  if (currentUser.email !== "admin@ofezo.com") {
    return <Navigate to="/" />;
  }

  return children;
}
