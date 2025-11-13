// admin.js

import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// UI Elements
const tabWallet = document.getElementById("tabWallet");
const tabOrders = document.getElementById("tabOrders");
const walletArea = document.getElementById("walletArea");
const ordersArea = document.getElementById("ordersArea");

// ----------------------
// 🔥 AUTH CHECK
// ----------------------
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "mshabib471@gmail.com") {
    alert("Access Denied!");
    window.location.href = "login.html";
  }
  loadWalletRequests();
});

// ----------------------
// 🔥 TAB SWITCH
// ----------------------
tabWallet.onclick = () => {
  tabWallet.classList.add("active");
  tabOrders.classList.remove("active");
  walletArea.style.display = "block";
  ordersArea.style.display = "none";
};
tabOrders.onclick = () => {
  tabOrders.classList.add("active");
  tabWallet.classList.remove("active");
  walletArea.style.display = "none";
  ordersArea.style.display = "block";
  loadOrders();
};

// ----------------------
// 🔥 Load Wallet Requests
// ----------------------
async function loadWalletRequests() {
  walletArea.innerHTML = "<h3 style='padding-left:12px;'>💰 Pending Wallet Requests</h3>";

  const snap = await getDocs(collection(db, "walletRequests"));
  let html = "";

  snap.forEach((d) => {
    const req = d.data();
    if (req.status === "pending") {
      html += `
      <div class="card">
        <b>${req.email}</b><br>
        Amount: ${req.amount} BDT <br>
        Method: ${req.method} <br>
        TrxID: ${req.trxid}<br><br>

        <button class="btn-green" onclick="approveWallet('${d.id}', '${req.user}', ${req.amount})">Approve</button>
        <button class="btn-red" onclick="rejectWallet('${d.id}')">Reject</button>
      </div>`;
    }
  });

  walletArea.innerHTML += html || "<p style='padding-left:12px;'>No pending requests</p>";
}

// ----------------------
// 🔥 APPROVE WALLET — FULL FIXED
// ----------------------
window.approveWallet = async function (docId, uid, amount) {
  try {
    const walletRef = doc(db, "wallets", uid);
    const walletSnap = await getDoc(walletRef);

    let newBalance = amount;
    if (walletSnap.exists()) {
      newBalance += walletSnap.data().balance;
    }

    // Update balance
    await setDoc(walletRef, { balance: newBalance });

    // Update request status
    await updateDoc(doc(db, "walletRequests", docId), {
      status: "approved"
    });

    alert("Wallet Approved Successfully!");
    loadWalletRequests();
  } catch (err) {
    alert("Error: " + err.message);
  }
};

// ----------------------
// ❌ Reject Wallet
// ----------------------
window.rejectWallet = async function (docId) {
  await updateDoc(doc(db, "walletRequests", docId), {
    status: "rejected"
  });
  alert("Rejected!");
  loadWalletRequests();
};

// ----------------------
// 🔥 Load Orders
// ----------------------
async function loadOrders() {
  ordersArea.innerHTML = "<h3 style='padding-left:12px;'>🛒 Pending Orders</h3>";

  const snap = await getDocs(collection(db, "orders"));
  let html = "";

  snap.forEach((d) => {
    const o = d.data();
    if (o.status === "pending") {
      html += `
      <div class="card">
        <b>${o.email}</b><br>
        Product: ${o.product}<br>
        Price: ${o.price} TK<br><br>
        <button class="btn-green" onclick="approveOrder('${d.id}')">Approve</button>
      </div>`;
    }
  });

  ordersArea.innerHTML += html || "<p style='padding-left:12px;'>No pending orders</p>";
}

// ----------------------
// 🔥 Approve Order
// ----------------------
window.approveOrder = async function (orderId) {
  await updateDoc(doc(db, "orders", orderId), { status: "approved" });
  alert("Order Approved!");
  loadOrders();
};

// ----------------------
// 🔥 Logout
// ----------------------
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};