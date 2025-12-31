/* ================= TAB SWITCH ================= */
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginTab.onclick = () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
};

registerTab.onclick = () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
};


/* ================= FIREBASE AUTH =================
   (REAL – demo না)
=================================================== */

// 🔴 STEP: Firebase config বসাতে হবে
// https://console.firebase.google.com
// Authentication → Email/Password → Enable

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

// Firebase SDK
import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js").then(({initializeApp})=>{
import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js").then(({getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword})=>{

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  window.login = function(){
    const email = document.getElementById("loginEmail").value;
    const pass  = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth,email,pass)
      .then(()=>{
        alert("Login Successful");
        window.location.href = "index.html";
      })
      .catch(err=>alert(err.message));
  }

  window.register = function(){
    const email = document.getElementById("registerEmail").value;
    const pass  = document.getElementById("registerPassword").value;

    createUserWithEmailAndPassword(auth,email,pass)
      .then(()=>{
        alert("Account Created");
        window.location.href = "index.html";
      })
      .catch(err=>alert(err.message));
  }

});
});
