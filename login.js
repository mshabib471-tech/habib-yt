/* =================================================
   FIREBASE IMPORT (MODULE)
================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =================================================
   FIREBASE CONFIG (YOUR PROJECT)
================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9"
};

/* =================================================
   INIT
================================================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =================================================
   ADMIN ROLE (EMAIL BASED)
================================================= */
const ADMIN_EMAIL = "admin@it-zone.com"; // ← change if needed

/* =================================================
   LOGIN
================================================= */
window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("Login successful");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

/* =================================================
   REGISTER
================================================= */
window.register = function () {
  const email = document.getElementById("registerEmail").value;
  const pass = document.getElementById("registerPassword").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("Account created");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

/* =================================================
   GOOGLE LOGIN
================================================= */
window.googleLogin = function () {
  signInWithPopup(auth, provider)
    .then(() => {
      alert("Google login successful");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

/* =================================================
   PASSWORD RESET
================================================= */
window.resetPassword = function () {
  const email = prompt("Enter your email for password reset:");
  if (!email) return;

  sendPasswordResetEmail(auth, email)
    .then(() => alert("Password reset email sent"))
    .catch(err => alert(err.message));
};

/* =================================================
   LOGOUT
================================================= */
window.logout = function () {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = "login.html";
  });
};

/* =================================================
   AUTH STATE (USER / ADMIN)
================================================= */
onAuthStateChanged(auth, user => {
  if (user) {
    document.body.classList.add("logged-in");

    if (user.email === ADMIN_EMAIL) {
      localStorage.setItem("role", "admin");
    } else {
      localStorage.setItem("role", "user");
    }

    localStorage.setItem("userEmail", user.email);
  }
});
