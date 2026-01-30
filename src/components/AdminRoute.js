import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { currentUser, currentUserData } = useAuth();

  // auth not loaded yet
  if (currentUser === undefined) {
    return <p style={{ padding: 40 }}>Checking login...</p>;
  }

  // not logged in
  if (!currentUser) {
    return <p style={{ padding: 40 }}>Please login first</p>;
  }

  // firestore not loaded
  if (!currentUserData) {
    return <p style={{ padding: 40 }}>Loading user data...</p>;
  }

  // not admin
  if (currentUserData.role !== "admin") {
    return (
      <p style={{ padding: 40, color: "red" }}>
        You are not admin
      </p>
    );
  }

  return children;
}
