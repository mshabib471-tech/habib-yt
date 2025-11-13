/**********************************************
🔥 HABIB YT — Full Firebase System (Final)
**********************************************/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  getFirestore, doc, setDoc, getDoc, addDoc,
  collection, getDocs, updateDoc, query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  storageBucket: "habib-yt.firebasestorage.app",
  messagingSenderId: "656628491244",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9"
};

// Initialize
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

/************* LOGIN SYSTEM *************/
window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

window.registerUser = async function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "wallets", auth.currentUser.uid), { balance: 0 });
  window.location.href = "dashboard.html";
};

window.googleLogin = async function () {
  await signInWithPopup(auth, provider);
  await setDoc(doc(db, "wallets", auth.currentUser.uid), { balance: 0 }, { merge: true });
  window.location.href = "dashboard.html";
};

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

/************* ADD MONEY *************/
window.submitAddMoney = async function () {
  const user = auth.currentUser;
  const amount = document.getElementById("amount").value;
  const trxid = document.getElementById("trxid").value;

  if (!amount || !trxid) return alert("সব ঘর পূরণ করুন!");

  await addDoc(collection(db, "walletRequests"), {
    user: user.uid,
    email: user.email,
    amount: Number(amount),
    method: "bKash",
    trxid,
    status: "pending",
    created: Date.now()
  });

  alert("Add Money Request Submitted!");
  window.location.href = "dashboard.html";
};

/************* ORDER PRODUCT *************/
window.orderProduct = async function (name, price) {
  const user = auth.currentUser;
  const walletRef = doc(db, "wallets", user.uid);
  const walletSnap = await getDoc(walletRef);

  const balance = walletSnap.exists() ? walletSnap.data().balance : 0;

  if (balance < price) return alert("❌ পর্যাপ্ত ব্যালেন্স নেই!");

  await addDoc(collection(db, "orders"), {
    user: user.uid,
    email: user.email,
    product: name,
    price: price,
    status: "pending",
    created: Date.now()
  });

  alert("Order submitted!");
};

/************* DASHBOARD LOAD *************/
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const emailField = document.getElementById("userEmail");
  const balField = document.getElementById("walletBalance");
  const ordersDiv = document.getElementById("recentOrders");

  if (emailField) emailField.textContent = user.email;

  // Load Wallet
  const walletDoc = await getDoc(doc(db, "wallets", user.uid));
  if (walletDoc.exists() && balField) {
    balField.textContent = walletDoc.data().balance + " BDT";
  }

  // Load Recent Orders
  if (ordersDiv) {
    const q = query(
      collection(db, "orders"),
      where("user", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      ordersDiv.innerHTML = "<p>কোনো অর্ডার পাওয়া যায়নি।</p>";
    } else {
      let html = "";
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        html += `
        <div class="order-item">
          <p><b>${d.product}</b></p>
          <p>Price: ${d.price} TK</p>
          <p>Status: ${d.status}</p>
        </div>`;
      });
      ordersDiv.innerHTML = html;
    }
  }
});