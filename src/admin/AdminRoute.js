import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setIsAdmin(snap.data().role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (loading || isAdmin === null) return null;

  if (!user || !isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
