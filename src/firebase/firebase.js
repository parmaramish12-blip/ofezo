

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQnIm-MlrgKV9YHgb1bxuhJLntA2i-zYM",
  authDomain: "ofezo-4b70b.firebaseapp.com",
  projectId: "ofezo-4b70b",
  storageBucket: "ofezo-4b70b.firebasestorage.app",
  messagingSenderId: "165518383711",
  appId: "1:165518383711:web:c0a0c083b099e8b96c19ea",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);



