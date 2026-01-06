import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ==== Firebase Config ==== */
const firebaseConfig = {
  apiKey: "AIzaSyAaLdtzOIZVYB-Bdc42CXm2T8iclWLc4o0",
  authDomain: "habib-yt.firebaseapp.com",
  projectId: "habib-yt",
  appId: "1:656628491244:web:e01ccd42bd8a2b1b4c96c9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ==== PROTECT PAGE + LOAD USER ==== */
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userEmail").value = user.email;
  document.getElementById("displayName").value = user.displayName || "";
  document.getElementById("photoURL").value = user.photoURL || "";
  document.getElementById("userPhoto").src =
    user.photoURL || "https://i.ibb.co/2y9Yw6R/avatar.png";
});

/* ==== UPDATE PROFILE ==== */
window.updateProfileInfo = function () {
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById("displayName").value;
  const photo = document.getElementById("photoURL").value;

  updateProfile(user, {
    displayName: name,
    photoURL: photo
  }).then(() => {
    alert("Profile updated");
    document.getElementById("userPhoto").src = photo;
  }).catch(err => alert(err.message));
};

/* ==== LOGOUT ==== */
window.logout = function () {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = "login.html";
  });
};
