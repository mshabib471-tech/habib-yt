// app.js (Final Full System)

import { auth, db, provider } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/************************************
      🚀 REGISTER USER
*************************************/
window.registerUser = async function () {
  const email = document.getElementById("signupEmail")?.value;
  const password = document.getElementById("signupPassword")?.value;

  if (!email || !password) return alert("সব ঘর পূরণ করুন!");

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    // Create wallet for new user
    await setDoc(doc(db, "wallets", auth.currentUser.uid), {
      balance: 0
    });

    alert("একাউন্ট তৈরি হয়েছে!");
    window.location.href = "dashboard.html";

  } catch (err) {
    alert(err.message);
  }
};

/************************************
      🚀 LOGIN USER
*************************************/
window.loginUser = async function () {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("লগইন ব্যর্থ: " + err.message);
  }
};

/************************************
      🚀 GOOGLE LOGIN
*************************************/
window.googleLogin = async function () {
  try {
    await signInWithPopup(auth, provider);

    // Wallet create if not exists
    const walletRef = doc(db, "wallets", auth.currentUser.uid);
    const w = await getDoc(walletRef);
    if (!w.exists()) {
      await setDoc(walletRef, { balance: 0 });
    }

    window.location.href = "dashboard.html";

  } catch (err) {
    alert("Google Login ব্যর্থ: " + err.message);
  }
};

/************************************
      🚀 LOGOUT
*************************************/
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

/************************************
      🚀 ADD MONEY (Wallet Request)
*************************************/
window.submitAddMoney = async function () {
  const user = auth.currentUser;
  if (!user) return alert("Login First!");

  const amount = document.getElementById("amount")?.value;
  const trxid = document.getElementById("trxid")?.value;

  if (!amount || !trxid) return alert("সব ঘর পূরণ করুন!");

  await addDoc(collection(db, "walletRequests"), {
    user: user.uid,
    email: user.email,
    amount: Number(amount),
    trxid,
    method: "bkash",
    status: "pending",
    created: new Date()
  });

  alert("Add Money Request Submitted!");
  window.location.href = "dashboard.html";
};

/************************************
      🚀 ORDER PRODUCT
*************************************/
window.orderProduct = async function (product, price) {
  const user = auth.currentUser;
  if (!user) return alert("লগইন করুন!");

  const walletRef = doc(db, "wallets", user.uid);
  const walletSnap = await getDoc(walletRef);

  const balance = walletSnap.exists() ? walletSnap.data().balance : 0;

  if (balance < price) {
    return alert("❌ ব্যালেন্স পর্যাপ্ত না!");
  }

  // Create order
  await addDoc(collection(db, "orders"), {
    user: user.uid,
    email: user.email,
    product,
    price,
    status: "pending",
    created: new Date()
  });

  // Deduct wallet balance
  await updateDoc(walletRef, { balance: balance - price });

  alert(`✅ অর্ডার সম্পন্ন: ${product} (${price} TK)`);
};

/************************************
      🚀 LOAD DASHBOARD
*************************************/
window.loadDashboard = function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Load Email
    document.getElementById("userEmail").textContent = user.email;

    // Load Balance
    const walletRef = doc(db, "wallets", user.uid);
    const w = await getDoc(walletRef);

    document.getElementById("walletBalance").textContent =
      w.exists() ? w.data().balance + " BDT" : "0 BDT";

    // Load Recent Orders
    const ordersDiv = document.getElementById("recentOrders");

    const q = query(
      collection(db, "orders"),
      where("user", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      ordersDiv.innerHTML = "<p>কোনো অর্ডার নেই</p>";
      return;
    }

    let html = "";
    snap.forEach((d) => {
      const x = d.data();
      html += `
        <div class="order-item">
          <p><b>${x.product}</b></p>
          <p>${x.price} TK</p>
          <p>Status: ${x.status}</p>
        </div>
      `;
    });

    ordersDiv.innerHTML = html;
  });
};