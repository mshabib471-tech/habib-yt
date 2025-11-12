/**********************************************
 🔥 HABIB YT — Full Firebase System (Final)
**********************************************/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// 🔹 তোমার Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9",
  measurementId: "G-GNY1T88D34"
};

// 🔹 Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ REGISTER
window.registerUser = async function() {
  const email = document.getElementById("signupEmail")?.value;
  const password = document.getElementById("signupPassword")?.value;
  if (!email || !password) return alert("সব ঘর পূরণ করুন!");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("একাউন্ট তৈরি হয়েছে!");
    window.location.href = "dashboard.html";
  } catch (err) { alert(err.message); }
};

// ✅ LOGIN
window.loginUser = async function() {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) { alert("লগইন ব্যর্থ: " + err.message); }
};

// ✅ GOOGLE LOGIN
window.googleLogin = async function() {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (err) { alert("Google Login ব্যর্থ: " + err.message); }
};

// ✅ LOGOUT
window.logout = async function() {
  await signOut(auth);
  window.location.href = "login.html";
};

// ✅ DASHBOARD INFO LOAD
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
});

// ✅ ADD MONEY
window.submitAddMoney = async function() {
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

  alert("Add Money Request Submitted ✅");
  window.location.href = "dashboard.html";
};

// ✅ ORDER PRODUCT (Free Fire, EFootball, Like ইত্যাদি)
window.orderProduct = async function(name, price) {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  try {
    await addDoc(collection(db, "orders"), {
      user: user.uid,
      email: user.email,
      product: name,
      price: price,
      status: "pending",
      created: new Date()
    });
    alert(`✅ ${name} অর্ডার সম্পন্ন হয়েছে!`);
  } catch (err) {
    alert("❌ অর্ডার ব্যর্থ: " + err.message);
  }
};

// ✅ ADMIN PANEL LOAD
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
            <p><b>${d.email}</b> — ${d.amount}৳ (${d.method})</p>
            <p>TrxID: ${d.trxid}</p>
            <button onclick="approveWallet('${docSnap.id}', '${d.user}', ${d.amount})">Approve</button>
          </div>
        `;
      }
    });
    moneyDiv.innerHTML = html || "<p>No Pending Wallet Requests</p>";
  }

  if (orderDiv) {
    const orders = await getDocs(collection(db, "orders"));
    let html = "";
    orders.forEach(o => {
      const d = o.data();
      if (d.status === "pending") {
        html += `
          <div class="card">
            <p><b>${d.email}</b> অর্ডার করেছেন <b>${d.product}</b> (${d.price}৳)</p>
            <button onclick="approveOrder('${o.id}')">Approve</button>
          </div>
        `;
      }
    });
    orderDiv.innerHTML = html || "<p>No Pending Orders</p>";
  }
});

// ✅ ADMIN — APPROVE WALLET
window.approveWallet = async function(docId, uid, amount) {
  const walletRef = doc(db, "wallets", uid);
  const walletDoc = await getDoc(walletRef);
  let newBalance = amount;
  if (walletDoc.exists()) {
    newBalance += walletDoc.data().balance || 0;
  }
  await setDoc(walletRef, { balance: newBalance });
  await updateDoc(doc(db, "walletRequests", docId), { status: "approved" });
  alert("Wallet Updated ✅");
  window.location.reload();
};

// ✅ ADMIN — APPROVE ORDER
window.approveOrder = async function(orderId) {
  await updateDoc(doc(db, "orders", orderId), { status: "approved" });
  alert("Order Approved ✅");
  window.location.reload();
};