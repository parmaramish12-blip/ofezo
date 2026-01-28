import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setCurrentUserData(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        const newUser = {
          email: user.email,
          profile: {
            ownerName: "",
            phone: "",
            city: "",
          },
          business: null,
          createdAt: serverTimestamp(),
        };

        await setDoc(ref, newUser);
        setCurrentUserData(newUser);
      } else {
        setCurrentUserData(snap.data());
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, currentUserData, setCurrentUserData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
