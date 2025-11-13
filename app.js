/**********************************************
 🔥 HABIB YT — FINAL FULL FIREBASE SYSTEM (FIXED)
**********************************************/

import { auth, db, provider } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc, setDoc, getDoc,
  addDoc, collection, updateDoc,
  getDocs, query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* -------------------- REGISTER -------------------- */
window.registerUser = async function () {
  const email = document.getElementById("signupEmail")?.value;
  const pass = document.getElementById("signupPassword")?.value;

  if (!email || !pass) return alert("সব ঘর পূরণ করুন!");

  try {
    let user = await createUserWithEmailAndPassword(auth, email, pass);

    await setDoc(doc(db, "wallets", user.user.uid), {
      balance: 0
    });

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};


/* -------------------- LOGIN -------------------- */
window.loginUser = async function () {
  const email = document.getElementById("loginEmail")?.value;
  const pass = document.getElementById("loginPassword")?.value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};


/* -------------------- GOOGLE LOGIN -------------------- */
window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);

    await setDoc(doc(db, "wallets", result.user.uid), {
      balance: 0
    }, { merge: true });

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};


/* -------------------- LOGOUT -------------------- */
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};


/* -------------------- ADD MONEY -------------------- */
window.submitAddMoney = async function () {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  const amount = document.getElementById("amount")?.value;
  const trxid = document.getElementById("trxid")?.value;

  if (!amount || !trxid) return alert("সব ঘর পূরণ করুন!");

  await addDoc(collection(db, "walletRequests"), {
    user: user.uid,
    email: user.email,
    amount: parseInt(amount),
    trxid,
    method: "bkash",
    status: "pending",
    created: new Date()
  });

  alert("Request Sent!");
  window.location.href = "dashboard.html";
};


/* -------------------- ORDER PRODUCT (Wallet Check + Auto Deduct) -------------------- */
window.orderProduct = async function (name, price) {
  const user = auth.currentUser;
  if (!user) return alert("⚠ প্রথমে লগইন করুন!");

  const walletRef = doc(db, "wallets", user.uid);
  const snap = await getDoc(walletRef);

  const balance = snap.exists() ? snap.data().balance : 0;

  // ❌ ব্যালেন্স কম হলে অর্ডার হবে না
  if (balance < price) {
    return alert(`❌ পর্যাপ্ত ব্যালেন্স নেই!\nপ্রয়োজন: ${price}৳\nবর্তমান: ${balance}৳`);
  }

  // অর্ডার Save
  await addDoc(collection(db, "orders"), {
    user: user.uid,
    email: user.email,
    product: name,
    price: price,
    status: "pending",
    created: new Date()
  });

  // Wallet deduct
  await updateDoc(walletRef, {
    balance: balance - price
  });

  alert(`✅ অর্ডার সম্পন্ন হয়েছে: ${name} (${price}৳)`);
};


/* -------------------- ADMIN PANEL — APPROVE WALLET -------------------- */
window.approveWallet = async function (docId, uid, amount) {
  const walletRef = doc(db, "wallets", uid);
  const snap = await getDoc(walletRef);

  let newBalance = amount;
  if (snap.exists()) newBalance += snap.data().balance;

  await setDoc(walletRef, { balance: newBalance });
  await updateDoc(doc(db, "walletRequests", docId), { status: "approved" });

  alert("Wallet Approved!");
  location.reload();
};


/* -------------------- ADMIN PANEL — APPROVE ORDER -------------------- */
window.approveOrder = async function (orderId) {
  await updateDoc(doc(db, "orders", orderId), { status: "approved" });
  alert("Order Approved!");
  location.reload();
};


/* -------------------- DASHBOARD LOAD -------------------- */
window.loadDashboard = async function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    document.getElementById("userEmail").innerText = user.email;

    // Load Wallet
    const walletSnap = await getDoc(doc(db, "wallets", user.uid));
    const bal = walletSnap.exists() ? walletSnap.data().balance : 0;
    document.getElementById("walletBalance").innerText = bal + " BDT";

    // Load Orders
    const q = query(
      collection(db, "orders"),
      where("user", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    const docs = await getDocs(q);
    let html = "";

    docs.forEach(d => {
      const data = d.data();
      html += `
        <div class="order-item">
          <b>${data.product}</b><br>
          ${data.price}৳ — <span>${data.status}</span>
        </div>`;
    });

    document.getElementById("recentOrders").innerHTML =
      html || "<p>কোনো অর্ডার নেই</p>";
  });
};