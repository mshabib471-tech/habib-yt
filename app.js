/**********************************************
 🔥 HABIB YT — FINAL FIXED VERSION (Balance Check Added)
**********************************************/

import { auth, db, provider } from "./firebase.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import { 
  doc, setDoc, getDoc, addDoc, updateDoc,
  collection, getDocs, query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/* ---------------------------------------------------
   SIGNUP
--------------------------------------------------- */
window.registerUser = async function () {
  const email = document.getElementById("signupEmail")?.value;
  const password = document.getElementById("signupPassword")?.value;

  if (!email || !password) return alert("সব ঘর পূরণ করুন!");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "wallets", auth.currentUser.uid), { balance: 0 });

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

/* ---------------------------------------------------
   LOGIN
--------------------------------------------------- */
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

/* ---------------------------------------------------
   GOOGLE LOGIN
--------------------------------------------------- */
window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(db, "wallets", result.user.uid), { balance: 0 }, { merge: true });

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

/* ---------------------------------------------------
   LOGOUT
--------------------------------------------------- */
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

/* ---------------------------------------------------
   ADD MONEY SUBMIT
--------------------------------------------------- */
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
    method: "bKash",
    trxid,
    status: "pending",
    created: new Date()
  });

  alert("Add Money Request Submitted!");
  window.location.href = "dashboard.html";
};

/* ---------------------------------------------------
   ORDER PRODUCT (with Balance Check)
--------------------------------------------------- */
window.orderProduct = async function (name, price) {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  // 🔥 CHECK BALANCE
  const walletRef = doc(db, "wallets", user.uid);
  const walletSnap = await getDoc(walletRef);

  let balance = walletSnap.exists() ? walletSnap.data().balance : 0;

  if (balance < price) {
    return alert(`❌ আপনার ওয়ালেটে পর্যাপ্ত টাকা নেই!\n\nপ্রয়োজনঃ ${price} TK\nবর্তমানঃ ${balance} TK`);
  }

  // 🔥 Create Order
  await addDoc(collection(db, "orders"), {
    user: user.uid,
    email: user.email,
    product: name,
    price: price,
    status: "pending",
    created: new Date()
  });

  // 🔥 Deduct Balance
  await updateDoc(walletRef, {
    balance: balance - price
  });

  alert(`✅ অর্ডার সম্পন্ন হয়েছে: ${name} (${price} TK)`);
};

/* ---------------------------------------------------
   DASHBOARD LOAD (fixed)
--------------------------------------------------- */
window.loadDashboard = function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    document.getElementById("userEmail").textContent = user.email;

    // 🔥 Wallet Load
    const walletRef = doc(db, "wallets", user.uid);
    const snap = await getDoc(walletRef);
    const bal = snap.exists() ? snap.data().balance : 0;
    document.getElementById("walletBalance").textContent = bal + " BDT";

    // 🔥 Recent Orders
    const q = query(
      collection(db, "orders"),
      where("user", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    const orders = await getDocs(q);
    let html = "";

    orders.forEach((o) => {
      const d = o.data();
      html += `
        <div class="order-item">
          <p><b>${d.product}</b></p>
          <p>Price: ${d.price} TK</p>
          <p>Status: ${d.status}</p>
        </div>
      `;
    });

    document.getElementById("recentOrders").innerHTML =
      html || "<p>কোনো অর্ডার পাওয়া যায়নি</p>";
  });
};