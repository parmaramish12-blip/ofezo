import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      setIsAdmin(snap.exists() && snap.data().role === "admin");
    };

    checkRole();
  }, [user]);

  if (loading || isAdmin === null) return null;

  if (!user || !isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
