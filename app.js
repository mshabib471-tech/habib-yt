/**********************************************
 🔥 HABIB YT — FINAL Firebase System (No Conflicts)
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

    // New wallet create
    await setDoc(doc(db, "wallets", auth.currentUser.uid), { balance: 0 });

    alert("একাউন্ট তৈরি হয়েছে!");
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
    alert("Google Login ব্যর্থ: " + err.message);
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
   ORDER PRODUCT
--------------------------------------------------- */
window.orderProduct = async function (name, price) {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  await addDoc(collection(db, "orders"), {
    user: user.uid,
    email: user.email,
    product: name,
    price: price,
    status: "pending",
    created: new Date()
  });

  alert("Order Submitted!");
};

/* ---------------------------------------------------
   DASHBOARD LOAD
--------------------------------------------------- */
window.loadDashboard = function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Email show
    document.getElementById("userEmail").textContent = user.email;

    // Wallet balance
    const wallet = await getDoc(doc(db, "wallets", user.uid));
    document.getElementById("walletBalance").textContent =
      wallet.exists() ? wallet.data().balance + " BDT" : "0 BDT";

    // Recent orders
    const q = query(
      collection(db, "orders"),
      where("user", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    const snap = await getDocs(q);
    let html = "";

    if (snap.empty) {
      html = "<p>কোনো অর্ডার পাওয়া যায়নি</p>";
    } else {
      snap.forEach((docx) => {
        const o = docx.data();
        html += `
          <div class="order-item">
            <p><b>${o.product}</b></p>
            <p>Price: ${o.price}৳</p>
            <p>Status: ${o.status}</p>
          </div>
        `;
      });
    }

    document.getElementById("recentOrders").innerHTML = html;
  });
};