/**********************************************
 🔥 HABIB YT — FINAL FULL FIREBASE SYSTEM v2.0
 Developed by GPT-5 for Habibur Rahman
**********************************************/

// Firebase Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ✅ তোমার Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ==========================
// 🔹 USER REGISTER
// ==========================
window.registerUser = async function() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  if (!email || !password) return alert("সব ঘর পূরণ করুন!");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    await setDoc(doc(db, "wallets", user.uid), { balance: 0 });
    alert("একাউন্ট তৈরি হয়েছে ✅");
    window.location.href = "dashboard.html";
  } catch (err) { alert(err.message); }
};

// ==========================
// 🔹 USER LOGIN
// ==========================
window.loginUser = async function() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) { alert("লগইন ব্যর্থ ❌: " + err.message); }
};

// ✅ GOOGLE LOGIN (Signup বা Login উভয়ের জন্য)
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

window.googleLogin = async function() {
  try {
    await signInWithPopup(auth, provider);
    alert("Google Login সফল ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Google Login ব্যর্থ ❌\n" + err.message);
  }
};

// ==========================
// 🔹 LOGOUT
// ==========================
window.logout = async function() {
  await signOut(auth);
  window.location.href = "login.html";
};

// ==========================
// 🔹 DASHBOARD INFO LOAD
// ==========================
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const emailField = document.getElementById("userEmail");
  const balanceField = document.getElementById("walletBalance");
  if (emailField) emailField.textContent = user.email;

  // Load Wallet
  const walletDoc = await getDoc(doc(db, "wallets", user.uid));
  if (walletDoc.exists() && balanceField) {
    balanceField.textContent = walletDoc.data().balance + " BDT";
  } else if (balanceField) {
    balanceField.textContent = "0 BDT";
  }

  // Load Orders (if orderList div exists)
  const orderDiv = document.getElementById("orderList");
  if (orderDiv) {
    const q = query(collection(db, "orders"), where("user", "==", user.uid));
    const snap = await getDocs(q);
    let html = "";
    snap.forEach(docSnap => {
      const d = docSnap.data();
      html += `
      <div class="order-item">
        <b>${d.product}</b> — ${d.amount} BDT 
        <p>Status: <span class="status-${d.status}">${d.status}</span></p>
      </div>`;
    });
    orderDiv.innerHTML = html || "<p>No orders yet.</p>";
  }
});

// ==========================
// 🔹 ADD MONEY
// ==========================
window.submitAddMoney = async function() {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  const amount = document.getElementById("amount").value;
  const method = document.getElementById("method").value;
  const trxid = document.getElementById("trxid").value;

  if (!amount || !trxid) return alert("সব ঘর পূরণ করুন!");

  await addDoc(collection(db, "walletRequests"), {
    user: user.uid,
    email: user.email,
    amount: parseInt(amount),
    method,
    trxid,
    status: "pending",
    created: new Date()
  });

  alert("💰 Add Money Request Submitted Successfully!");
  window.location.href = "dashboard.html";
};

// ==========================
// 🔹 PLACE ORDER
// ==========================
window.placeOrder = async function(product, amount, details) {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  await addDoc(collection(db, "orders"), {
    user: user.uid,
    email: user.email,
    product,
    amount,
    details: details || "",
    status: "pending",
    created: new Date()
  });

  alert("📦 Order Submitted Successfully!");
  window.location.href = "dashboard.html";
};

// ==========================
// 🔹 ADMIN PANEL LOAD
// ==========================
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  if (user.email !== "mshabib471@gmail.com") return;

  const moneyDiv = document.getElementById("pendingMoney");
  const orderDiv = document.getElementById("pendingOrders");
  
  if (moneyDiv) {
    const snapshot = await getDocs(collection(db, "walletRequests"));
    let html = "";
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      if (d.status === "pending") {
        html += `
        <div class="card">
          <p><b>${d.email}</b> — ${d.amount} BDT (${d.method})</p>
          <p>TrxID: ${d.trxid}</p>
          <div class="actions">
            <button class="btn-approve" onclick="approveWallet('${docSnap.id}', '${d.user}', ${d.amount})">Approve</button>
            <button class="btn-reject" onclick="rejectWallet('${docSnap.id}')">Reject</button>
          </div>
        </div>`;
      }
    });
    moneyDiv.innerHTML = html || "<p>✅ No Pending Wallet Requests.</p>";
  }

  if (orderDiv) {
    const snapshot = await getDocs(collection(db, "orders"));
    let html = "";
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      if (d.status === "pending") {
        html += `
        <div class="card">
          <p><b>${d.email}</b> ordered <b>${d.product}</b> — ${d.amount} BDT</p>
          <p>Status: ${d.status}</p>
          <div class="actions">
            <button class="btn-approve" onclick="completeOrder('${docSnap.id}')">Complete</button>
            <button class="btn-reject" onclick="cancelOrder('${docSnap.id}')">Cancel</button>
          </div>
        </div>`;
      }
    });
    orderDiv.innerHTML = html || "<p>✅ No Pending Orders.</p>";
  }
});

// ==========================
// 🔹 ADMIN ACTIONS
// ==========================
window.approveWallet = async function(docId, uid, amount) {
  const walletRef = doc(db, "wallets", uid);
  const walletDoc = await getDoc(walletRef);
  let newBalance = amount;
  if (walletDoc.exists()) newBalance += walletDoc.data().balance || 0;
  await setDoc(walletRef, { balance: newBalance });
  await updateDoc(doc(db, "walletRequests", docId), { status: "approved" });
  alert("✅ Wallet Updated Successfully!");
  window.location.reload();
};

window.rejectWallet = async function(docId) {
  await updateDoc(doc(db, "walletRequests", docId), { status: "rejected" });
  alert("❌ Wallet Request Rejected.");
  window.location.reload();
};

window.completeOrder = async function(docId) {
  await updateDoc(doc(db, "orders", docId), { status: "completed" });
  alert("✅ Order Completed!");
  window.location.reload();
};

window.cancelOrder = async function(docId) {
  await updateDoc(doc(db, "orders", docId), { status: "cancelled" });
  alert("❌ Order Cancelled!");
  window.location.reload();
};

// ✅ SESSION SAVE / AUTO LOGIN
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User logged in, auto redirect
    if (window.location.pathname.includes("login.html")) {
      window.location.href = "dashboard.html";
    }
  } else {
    // Not logged in, redirect if on protected page
    const protectedPages = ["dashboard.html", "add-money.html", "order.html", "admin.html"];
    if (protectedPages.some(p => window.location.pathname.includes(p))) {
      window.location.href = "login.html";
    }
  }
});