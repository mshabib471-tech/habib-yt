/* =================================================
   SAFE DOM LOAD
================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= MOBILE MENU ================= */
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

  /* ================= PRODUCT LOAD ================= */
  const productContainer = document.getElementById("productContainer");

  if (!productContainer) {
    console.warn("productContainer not found");
    return;
  }

  if (typeof products === "undefined") {
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

    productContainer.insertAdjacentHTML("beforeend", `
      <div class="pro" onclick="openProductModal(${p.id})">
        <img src="${p.image}" alt="${p.name}">
        <div class="des">
          <span>${p.brand}</span>
          <h5>${p.name}</h5>
          <div class="star">${stars}</div>
          <h4>$${p.price}</h4>
        </div>
        <a href="javascript:void(0)"
           onclick="event.stopPropagation(); addToCart(${p.id});">
          <i class="fa fa-shopping-cart"></i>
        </a>
      </div>
    `);
  });

});


/* =================================================
   PRODUCT MODAL (MOBILE SAFE + BACK SUPPORT)
================================================= */
let modalOpen = false;

function openProductModal(productId) {
  if (typeof products === "undefined") return;

  const modal = document.getElementById("productModal");
  if (!modal) return;

  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("modalImg").src = product.image;
  document.getElementById("modalTitle").innerText = product.name;
  document.getElementById("modalPrice").innerText = "$" + product.price;

  modal.classList.remove("hidden");
  modalOpen = true;

  // browser back support
  history.pushState({ modal: true }, "");
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  modal.classList.add("hidden");
  modalOpen = false;
}

/* BACK BUTTON CLOSE MODAL */
window.addEventListener("popstate", () => {
  if (modalOpen) {
    closeModal();
  }
});


/* =================================================
   CART SYSTEM (LOCAL STORAGE)
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
  alert("Product added to cart");
}


/* =================================================
   PWA INSTALL (ANDROID + iOS FIXED)
================================================= */
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

["installApp", "installApp2"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else {
        alert("Browser menu → Add to Home Screen");
      }
    });
  }
});


/* =================================================
   iOS INSTALL GUIDE
================================================= */
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.navigator.standalone;

if (isIos && !isStandalone) {
  console.log("iOS user – install via Add to Home Screen");
}


/* =================================================
   UX FIX
================================================= */
document.body.style.overscrollBehavior = "none";
