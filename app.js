// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Firebase Config (তোমার নিজের config নিচে রাখো)
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Page Navigation Function
window.go = function(page) {
  window.location.href = page;
};

// 🔹 Login System (যদি login.html এ থাকে)
if (window.location.pathname.includes("login.html")) {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ লগইন সফল হয়েছে!");
        window.location.href = "dashboard.html";
      } catch (error) {
        alert("❌ Login Failed: " + error.message);
      }
    });
  }
}

// 🔹 Dashboard Info Loader
if (window.location.pathname.includes("dashboard.html")) {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      document.getElementById("userEmail").innerText = user.email;
      const userDoc = doc(db, "users", user.uid);
      const snap = await getDoc(userDoc);
      if (snap.exists()) {
        document.getElementById("walletBalance").innerText = snap.data().balance || 0;
      }
    } else {
      window.location.href = "login.html";
    }
  });
}

// 🔹 Add Money Request
if (window.location.pathname.includes("add-money.html")) {
  document.getElementById("addMoneyBtn")?.addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");
    const ref = doc(db, "walletRequests", user.uid);
    await setDoc(ref, { amount, status: "pending", createdAt: new Date() });
    alert("✅ Request submitted! Pending verification.");
  });
}

// 🔹 Logout
window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};