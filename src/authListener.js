import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

let currentUser = null;

export const listenAuth = (setUser) => {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    setUser(user);
  });
};

export const getCurrentUser = () => currentUser;
