/* =================================================
   SAFE DOM LOAD
================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =================================================
     MOBILE MENU (SMOOTH SLIDE)
  ================================================= */
  const bar = document.getElementById("bar");
  const nav = document.getElementById("navbar");
  const closeBtn = document.getElementById("close");

  if (bar && nav) {
    bar.addEventListener("click", () => {
      nav.classList.add("active");
    });
  }

  if (closeBtn && nav) {
    closeBtn.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  }

  /* =================================================
     PRODUCT LOAD FROM products.js
  ================================================= */
  const productContainer = document.getElementById("productContainer");

  if (!productContainer) {
    console.warn("⚠ productContainer not found");
    return;
  }

  if (typeof products === "undefined") {
    console.error("❌ products.js not loaded");
    productContainer.innerHTML =
      "<p style='text-align:center'>Products not available</p>";
    return;
  }

  productContainer.innerHTML = "";

  products.forEach((p) => {

    let stars = "";
    for (let i = 0; i < p.rating; i++) {
      stars += `<i class="fas fa-star"></i>`;
    }

    productContainer.innerHTML += `
      <div class="pro" onclick="openProductModal(${p.id})">
        <img src="${p.image}" alt="${p.name}">
        <div class="des">
          <span>${p.brand}</span>
          <h5>${p.name}</h5>
          <div class="star">${stars}</div>
          <h4>$${p.price}</h4>
        </div>
        <a href="javascript:void(0)" onclick="event.stopPropagation(); addToCart(${p.id});">
          <i class="fa fa-shopping-cart"></i>
        </a>
      </div>
    `;
  });

  console.log("✅ Products loaded:", products.length);

  /* =================================================
     INSTALL APP IMAGE CLICK (POPUP OPEN)
  ================================================= */
  const installImg1 = document.getElementById("installApp");
  const installImg2 = document.getElementById("installApp2");
  const pwaBox = document.getElementById("pwa-install");

  if (installImg1 && pwaBox) {
    installImg1.onclick = () => pwaBox.classList.remove("hidden");
  }

  if (installImg2 && pwaBox) {
    installImg2.onclick = () => pwaBox.classList.remove("hidden");
  }

});


/* =================================================
   PRODUCT MODAL (POPUP)
================================================= */
function openProductModal(productId) {
  const modal = document.getElementById("productModal");
  if (!modal || typeof products === "undefined") return;

  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("modalImg").src = product.image;
  document.getElementById("modalTitle").innerText = product.name;
  document.getElementById("modalPrice").innerText = "$" + product.price;

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.classList.add("hidden");
}


/* =================================================
   CART SYSTEM (LOCALSTORAGE)
================================================= */
function addToCart(productId) {
  if (typeof products === "undefined") return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const exist = cart.find(item => item.id === productId);

  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Product added to cart");
}


/* =================================================
   PWA INSTALL (ANDROID + iOS)
================================================= */
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

/* Install button inside popup */
const installBtn = document.getElementById("installBtn");
const closePwa = document.getElementById("closePwa");
const pwaBox = document.getElementById("pwa-install");

if (installBtn) {
  installBtn.onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (pwaBox) pwaBox.classList.add("hidden");
    } else {
      alert("Open browser menu → Add to Home Screen");
    }
  };
}

if (closePwa && pwaBox) {
  closePwa.onclick = () => pwaBox.classList.add("hidden");
}

/* iOS AUTO GUIDE */
const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandalone = window.navigator.standalone === true;

if (isIos && !isInStandalone && pwaBox) {
  setTimeout(() => {
    pwaBox.classList.remove("hidden");
    if (installBtn) installBtn.style.display = "none";
    if (closePwa) {
      closePwa.innerText = "How to Install?";
      closePwa.onclick = () =>
        alert("Safari → Share → Add to Home Screen");
    }
  }, 2500);
}


/* =================================================
   UX FIX
================================================= */
document.body.style.overscrollBehavior = "none";
