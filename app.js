/**********************************************
 🔥 HABIB YT — FULL FIREBASE SYSTEM (Final)
**********************************************/

// Firebase Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// তোমার Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ REGISTER USER
window.registerUser = async function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) return alert("সব ঘর পূরণ করুন!");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ একাউন্ট তৈরি হয়েছে!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("⚠ " + err.message);
  }
};

// ✅ LOGIN USER
window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("⚠ লগইন ব্যর্থ: " + err.message);
  }
};

// ✅ GOOGLE LOGIN
const provider = new GoogleAuthProvider();
window.googleLogin = async function () {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

// ✅ LOGOUT
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ✅ AUTO REDIRECT CHECK (Login Required)
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const protectedPages = [
    "dashboard.html",
    "add-money.html",
    "order.html",
    "admin.html",
  ];
  if (!user && protectedPages.some((p) => path.includes(p))) {
    window.location.href = "login.html";
  }
});

// ✅ LOAD DASHBOARD INFO
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const emailField = document.getElementById("userEmail");
  const balanceField = document.getElementById("walletBalance");

  if (emailField) emailField.textContent = user.email;

  const walletDoc = await getDoc(doc(db, "wallets", user.uid));
  if (walletDoc.exists() && balanceField) {
    balanceField.textContent = walletDoc.data().balance + " BDT";
  } else if (balanceField) {
    balanceField.textContent = "0 BDT";
  }

  // Show user orders if available
  const ordersDiv = document.getElementById("recentOrders");
  if (ordersDiv) {
    const snapshot = await getDocs(collection(db, "orders"));
    let html = "";
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.user === user.uid) {
        html += `
          <div style="background:#f8f9ff; padding:10px; margin-bottom:8px; border-radius:8px;">
            <b>${d.product}</b> — ${d.amount} BDT<br>
            Status: ${d.status}
          </div>`;
      }
    });
    ordersDiv.innerHTML = html || "আপনার কোনো অর্ডার নেই।";
  }
});

// ✅ ADD MONEY (Firebase Add)
window.submitAddMoney = async function () {
  const user = auth.currentUser;
  if (!user) return alert("⚠ লগইন করুন প্রথমে!");

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
    created: new Date(),
  });

  alert("✅ Add Money Request Submitted!");
  window.location.href = "dashboard.html";
};

// ✅ ADMIN PANEL LOAD
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // শুধুমাত্র Admin মেইল
  if (user.email !== "mshabib471@gmail.com") return;

  const moneyDiv = document.getElementById("pendingMoney");
  const orderDiv = document.getElementById("pendingOrders");

  if (moneyDiv) {
    const snapshot = await getDocs(collection(db, "walletRequests"));
    let html = "";
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.status === "pending") {
        html += `
          <div class="card">
            <p><b>${d.email}</b> — ${d.amount} BDT (${d.method})</p>
            <p>TrxID: ${d.trxid}</p>
            <div class="btn-group">
              <button class="approve" onclick="approveWallet('${docSnap.id}','${d.user}',${d.amount})">Approve</button>
              <button class="reject" onclick="rejectWallet('${docSnap.id}')">Reject</button>
            </div>
          </div>`;
      }
    });
    moneyDiv.innerHTML = html || "✅ No Pending Requests.";
  }

  if (orderDiv) {
    orderDiv.innerHTML = "🕓 Order Management coming soon...";
  }
});

// ✅ ADMIN — APPROVE WALLET
window.approveWallet = async function (docId, uid, amount) {
  const walletRef = doc(db, "wallets", uid);
  const walletDoc = await getDoc(walletRef);
  let newBalance = amount;
  if (walletDoc.exists()) {
    newBalance += walletDoc.data().balance || 0;
  }
  await setDoc(walletRef, { balance: newBalance });
  await updateDoc(doc(db, "walletRequests", docId), { status: "approved" });
  alert("✅ Wallet Updated!");
  window.location.reload();
};

// ✅ ADMIN — REJECT WALLET
window.rejectWallet = async function (docId) {
  await updateDoc(doc(db, "walletRequests", docId), { status: "rejected" });
  alert("❌ Request Rejected");
  window.location.reload();
};