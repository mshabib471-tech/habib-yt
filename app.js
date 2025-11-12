/**********************************************
 🔥 HABIB YT — FULL FIREBASE SYSTEM (Final)
**********************************************/

// Firebase Import
import { app } from "./firebase.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Initialize
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* ===============================
   ✅ REGISTER (Signup)
================================ */
window.registerUser = async function() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) return alert("⚠️ সব ঘর পূরণ করুন!");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ একাউন্ট তৈরি হয়েছে!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
};

/* ===============================
   ✅ LOGIN (Email + Password)
================================ */
window.loginUser = async function() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ লগইন সফল!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("❌ লগইন ব্যর্থ: " + err.message);
  }
};

/* ===============================
   ✅ GOOGLE LOGIN
================================ */
window.googleLogin = async function() {
  try {
    await signInWithPopup(auth, provider);
    alert("✅ Google Login Successful!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("❌ Google Login Failed: " + err.message);
  }
};

/* ===============================
   ✅ LOGOUT
================================ */
window.logout = async function() {
  await signOut(auth);
  alert("👋 Logged out successfully!");
  window.location.href = "login.html";
};

/* ===============================
   ✅ DASHBOARD INFO LOAD
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (window.location.pathname.includes("dashboard")) {
      window.location.href = "login.html";
    }
    return;
  }

  const emailField = document.getElementById("userEmail");
  const balanceField = document.getElementById("walletBalance");

  if (emailField) emailField.textContent = user.email;

  // Load wallet balance
  const walletDoc = await getDoc(doc(db, "wallets", user.uid));
  if (walletDoc.exists() && balanceField) {
    balanceField.textContent = walletDoc.data().balance + " BDT";
  } else if (balanceField) {
    balanceField.textContent = "0 BDT";
  }
});

/* ===============================
   ✅ ADD MONEY REQUEST
================================ */
window.submitAddMoney = async function() {
  const user = auth.currentUser;
  if (!user) return alert("⚠️ লগইন করুন প্রথমে!");

  const amount = document.getElementById("amount").value;
  const method = "bKash"; // Only bKash now
  const trxid = document.getElementById("trxid").value;

  if (!amount || !trxid) return alert("⚠️ সব ঘর পূরণ করুন!");

  await addDoc(collection(db, "walletRequests"), {
    user: user.uid,
    email: user.email,
    amount: parseInt(amount),
    method,
    trxid,
    status: "pending",
    created: new Date()
  });

  alert("✅ Add Money Request Submitted!");
  window.location.href = "dashboard.html";
};

/* ===============================
   ✅ ADMIN PANEL LOAD
================================ */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // শুধুমাত্র এডমিন মেইল
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
          <div style="border:1px solid #ddd; border-radius:8px; padding:10px; margin:10px;">
            <p><b>${d.email}</b> — ${d.amount} BDT (${d.method})</p>
            <p>TrxID: ${d.trxid}</p>
            <button onclick="approveWallet('${docSnap.id}','${d.user}',${d.amount})" style="background:#28a745;color:white;border:none;padding:5px 10px;border-radius:5px;">Approve</button>
            <button onclick="rejectWallet('${docSnap.id}')" style="background:#dc3545;color:white;border:none;padding:5px 10px;border-radius:5px;">Reject</button>
          </div>
        `;
      }
    });
    moneyDiv.innerHTML = html || "✅ No Pending Requests.";
  }

  if (orderDiv) orderDiv.innerHTML = "🕓 Order Management coming soon...";
});

/* ===============================
   ✅ ADMIN — APPROVE WALLET
================================ */
window.approveWallet = async function(docId, uid, amount) {
  const walletRef = doc(db, "wallets", uid);
  const walletDoc = await getDoc(walletRef);
  let newBalance = amount;
  if (walletDoc.exists()) {
    newBalance += walletDoc.data().balance || 0;
  }
  await setDoc(walletRef, { balance: newBalance });
  await updateDoc(doc(db, "walletRequests", docId), { status: "approved" });
  alert("✅ Wallet Approved & Updated");
  window.location.reload();
};

/* ===============================
   ✅ ADMIN — REJECT WALLET
================================ */
window.rejectWallet = async function(docId) {
  await updateDoc(doc(db, "walletRequests", docId), { status: "rejected" });
  alert("❌ Request Rejected");
  window.location.reload();
};