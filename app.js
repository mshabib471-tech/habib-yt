// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// তোমার Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Simple page navigation
window.go = function(page) {
  window.location.href = page;
};

// Logout system
window.logout = function() {
  signOut(auth).then(() => {
    alert("লগআউট সফল হয়েছে!");
    window.location.href = "login.html";
  }).catch(err => alert("Error: " + err.message));
};

// Auth Check (Dashboard এর জন্য)
if (window.location.pathname.includes("dashboard.html")) {
  onAuthStateChanged(auth, user => {
    if (!user) {
      alert("Please Login First!");
      window.location.href = "login.html";
    }
  });
}