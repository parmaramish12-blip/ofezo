import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser, currentUserData } = useAuth();

  // wait for auth
  if (currentUser === undefined || currentUser === null) {
    return <p style={{ padding: 40 }}>Checking access...</p>;
  }

  // wait for firestore user
  if (!currentUserData) {
    return <p style={{ padding: 40 }}>Loading admin data...</p>;
  }

  // admin check
  if (currentUserData.role !== "admin") {
    return <p style={{ padding: 40, color: "red" }}>
      Access denied. Admin only.
    </p>;
  }

  return children;
}
