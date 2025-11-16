// firebase.js — Clean Config

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

console.log("🔥 Firebase Loaded");