/* ================= FIREBASE MODULE IMPORT ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ================= YOUR FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9"
};

/* ================= INIT ================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* ================= EMAIL LOGIN ================= */
window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  if (!email || !pass) {
    alert("Please fill all fields");
    return;
  }

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      window.location.href = "index.html"; // dashboard
    })
    .catch(err => alert(err.message));
};

/* ================= REGISTER ================= */
window.register = function () {
  const email = document.getElementById("registerEmail").value;
  const pass = document.getElementById("registerPassword").value;

  if (!email || !pass) {
    alert("Please fill all fields");
    return;
  }

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      window.location.href = "index.html"; // dashboard
    })
    .catch(err => alert(err.message));
};

/* ================= GOOGLE LOGIN ================= */
window.googleLogin = function () {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "index.html"; // dashboard
    })
    .catch(err => alert(err.message));
};

/* ================= PASSWORD RESET ================= */
window.resetPassword = function (email) {
  if (!email) {
    alert("Enter your email");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => alert("Password reset email sent"))
    .catch(err => alert(err.message));
};

/* ================= AUTO REDIRECT IF LOGGED IN ================= */
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("userEmail", user.email);
    // Already logged in → dashboard
    // (avoid loop in login page)
    if (!window.location.pathname.includes("index.html")) {
      console.log("Logged in as:", user.email);
    }
  }
});
