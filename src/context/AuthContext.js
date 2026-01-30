import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=2563eb&color=fff`;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      try {
        if (!user) {
          setCurrentUser(null);
          setCurrentUserData(null);
          setLoading(false);
          return;
        }

        setCurrentUser(user);

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        // 🔥 CREATE USER IF NOT EXISTS
        if (!snap.exists()) {
          const newUser = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL:
              user.photoURL || getAvatar(user.displayName),
            phone: "",
            city: "",
            state: "",
            businessProfile: null,
            subscription: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await setDoc(userRef, newUser);
          setCurrentUserData(newUser);
        } else {
          setCurrentUserData(snap.data());
        }
      } catch (err) {
        console.error("AuthContext error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserData,
        setCurrentUserData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
