/**********************************************
 🔥 HABIB YT — FULL FIREBASE SYSTEM (Final)
**********************************************/

// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// 🧩 তোমার Firebase Config
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

// ✅ TEST CONNECTION
document.getElementById("check")?.addEventListener("click", () => {
  const output = document.getElementById("output");
  output.textContent = "✅ Firebase Connected Successfully!\nProject: habib-yt";
});

// ✅ REGISTER (Signup)
window.registerUser = async function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  if (!email || !password) return alert("সব ঘর পূরণ করুন!");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("একাউন্ট তৈরি হয়েছে ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("ত্রুটি: " + err.message);
  }
};

// ✅ LOGIN (Email/Password)
window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("লগইন সফল ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("লগইন ব্যর্থ ❌\n" + err.message);
  }
};

// ✅ GOOGLE LOGIN (Signup + Login)
const provider = new GoogleAuthProvider();
window.googleLogin = async function () {
  try {
    await signInWithPopup(auth, provider);
    alert("Google Login সফল ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Google Login ব্যর্থ ❌\n" + err.message);
  }
};

// ✅ LOGOUT
window.logout = async function () {
  await signOut(auth);
  alert("লগআউট হয়েছে ✅");
  window.location.href = "login.html";
};

// ✅ SESSION (Auto Redirect if Logged)
onAuthStateChanged(auth, (user) => {
  const current = window.location.pathname;
  const loggedPages = ["login.html", "signup.html"];
  if (user && loggedPages.some(p => current.includes(p))) {
    window.location.href = "dashboard.html";
  } else if (!user && current.includes("dashboard.html")) {
    window.location.href = "login.html";
  }
});

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
window.submitAddMoney = async function () {
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

  alert("Add Money Request Submitted ✅");
  window.location.href = "dashboard.html";
};

// ✅ ADMIN PANEL (Habib Only)
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
          <div style="border:1px solid #ccc; margin:10px; padding:10px; border-radius:8px;">
            <p><b>${d.email}</b> — ${d.amount} BDT (${d.method})</p>
            <p>TrxID: ${d.trxid}</p>
            <button onclick="approveWallet('${docSnap.id}', '${d.user}', ${d.amount})">✅ Approve</button>
          </div>
        `;
      }
    });
    moneyDiv.innerHTML = html || "No Pending Requests.";
  }

  if (orderDiv) {
    orderDiv.innerHTML = "No Pending Orders Yet...";
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
  alert("Wallet Updated ✅");
  window.location.reload();
};