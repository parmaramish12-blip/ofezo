// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

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
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          subscription: {
            active: false,
            plan: null,
            startDate: null,
            endDate: null,
          },
          createdAt: serverTimestamp(),
        };

        await setDoc(ref, newUser);
        setCurrentUserData(newUser);
        setLoading(false);
        return;
      }

      const data = snap.data();

      // auto expiry
      if (
        data.subscription?.active &&
        data.subscription?.endDate?.toDate() < new Date()
      ) {
        await updateDoc(ref, {
          "subscription.active": false,
        });
        data.subscription.active = false;
      }

      setCurrentUserData(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserData,
        loading,
        setCurrentUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
