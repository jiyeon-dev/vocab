import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "react-voca-455e7.firebaseapp.com",
  projectId: "react-voca-455e7",
  storageBucket: "react-voca-455e7.appspot.com",
  messagingSenderId: "611102289676",
  appId: "1:611102289676:web:12de4b377550373fd56329",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore();
