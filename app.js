// app.js
// Copy-paste this file as /habibyt/app.js
// Exports: go, auth, db, provider, ensureUserDoc, requireAuth, ADMIN_EMAIL

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/* ====== Put your Firebase config here (already confirmed) ====== */
export const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34"
};
/* =============================================================== */

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const ADMIN_EMAIL = "mshabib471@gmail.com"; // admin email (use this to protect admin page)

export function go(page) {
  window.location.href = page;
}

/**
 * ensureUserDoc(user)
 * Create user doc in "users" collection with default fields (if not exists)
 * user: firebase user object with .email and .displayName
 */
export async function ensureUserDoc(user) {
  if (!user || !user.email) return;
  const userRef = doc(db, "users", user.email);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      balance: 0,
      createdAt: serverTimestamp()
    });
  }
}

/**
 * requireAuth(redirectTo)
 * simple helper to redirect to login if not auth
 */
export function requireAuth(redirectTo = "login.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = redirectTo;
        resolve(null);
      } else {
        resolve(user);
      }
    });
  });
}