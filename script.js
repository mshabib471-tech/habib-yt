/* ================= iOS 26 SCRIPT ================= */

/* ---------- Disable iOS white bounce ---------- */
document.body.style.overscrollBehavior = "none";

/* ---------- NAVBAR TOGGLE (Mobile) ---------- */
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.style.display = "flex";
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
    nav.style.display = "none";
  });
}

/* ---------- APP LIKE TAP EFFECT ---------- */
document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("touchstart", () => {
    el.style.opacity = "0.6";
  });
  el.addEventListener("touchend", () => {
    el.style.opacity = "1";
  });
});

/* ---------- PRODUCT CLICK (FULL CARD CLICKABLE) ---------- */
document.querySelectorAll(".pro").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
});

/* ---------- SHOPPING CART CLICK FIX ---------- */
document.querySelectorAll(".fa-shopping-cart").forEach(cart => {
  cart.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "cart.html";
  });
});

/* ---------- SMOOTH PAGE LOAD (APP FEEL) ---------- */
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity .4s ease";
    document.body.style.opacity = "1";
  }, 50);
});

/* ---------- BOTTOM TAB ACTIVE STATE ---------- */
const tabs = document.querySelectorAll(".bottom-tab a");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

/* ---------- iOS STYLE SCROLL SHADOW ---------- */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = "0 8px 30px rgba(0,0,0,.12)";
  } else {
    header.style.boxShadow = "none";
  }
});

/* ---------- INSTALL APP PROMPT (PWA) ---------- */
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("PWA Ready to install");
});

/* ---------- FORCE SAFARI FIX ---------- */
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

/* ---------- SAFE AREA (iPhone Notch Fix) ---------- */
const style = document.createElement("style");
style.innerHTML = `
body{
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom-tab{
  padding-bottom: env(safe-area-inset-bottom);
}
`;
document.head.appendChild(style);

/* ---------- iOS 26 FINISH ---------- */
console.log("iOS 26 UI Loaded Successfully 🚀");
