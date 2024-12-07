import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "XETmGtCcDd-ioQ24hkHir7GV013CrF0U7X37UNADa1k",
  authDomain: "rbac-6bad8.firebaseapp.com",
  projectId: "rbac-6bad8",
  storageBucket: "rbac-6bad8.firebasestorage.app",
  messagingSenderId: "240050939285",
  appId: "1:240050939285:web:3e9a0f81bbdfe0ef47029c",
  measurementId: "G-S8LVVVCSG6"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app);
