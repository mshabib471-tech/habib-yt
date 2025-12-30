/* ================= SAFE DOM LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= NAVBAR TOGGLE ================= */
  const bar = document.getElementById("bar");
  const nav = document.getElementById("navbar");
  const close = document.getElementById("close");

  if (bar) {
    bar.addEventListener("click", () => {
      nav.style.display = "flex";
    });
  }

  if (close) {
    close.addEventListener("click", () => {
      nav.style.display = "none";
    });
  }

  /* ================= MOBILE MENU FIX ================= */
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const closeBtn = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

  
  /* ================= PRODUCT LOAD ================= */
  const productContainer = document.getElementById("productContainer");

  if (productContainer && typeof products !== "undefined") {
    productContainer.innerHTML = "";

    products.forEach(p => {

      let stars = "";
      for (let i = 0; i < p.rating; i++) {
        stars += `<i class="fas fa-star"></i>`;
      }

      productContainer.innerHTML += `
        <div class="pro">
          <img src="${p.image}" alt="${p.name}">
          <div class="des">
            <span>${p.brand}</span>
            <h5>${p.name}</h5>
            <div class="star">${stars}</div>
            <h4>$${p.price}</h4>
          </div>
          <a href="javascript:void(0)" onclick="addToCart(${p.id})">
            <i class="fa fa-shopping-cart"></i>
          </a>
        </div>
      `;
    });

    console.log("✅ Products loaded:", products.length);
  } else {
    console.warn("⚠ productContainer or products not found");
  }

  /* ================= PWA INSTALL IMAGE CLICK ================= */
  const installImg1 = document.getElementById("installApp");
  const installImg2 = document.getElementById("installApp2");
  const pwaPopup = document.getElementById("pwa-install");

  if (installImg1 && pwaPopup) {
    installImg1.addEventListener("click", () => {
      pwaPopup.classList.remove("hidden");
    });
  }

  if (installImg2 && pwaPopup) {
    installImg2.addEventListener("click", () => {
      pwaPopup.classList.remove("hidden");
    });
  }

});


/* ================= CART SYSTEM ================= */
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


/* ================= INSTALL APP FIX ================= */
let deferredPrompt;
const installBox = document.getElementById("pwa-install");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

const installImgs = [document.getElementById("installApp"), document.getElementById("installApp2")];

installImgs.forEach(img=>{
  if(img){
    img.addEventListener("click", async ()=>{
      if(deferredPrompt){
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }else{
        // iOS Guide
        alert("Safari → Share → Add to Home Screen");
      }
    });
  }
});


/* ================= UX FIX ================= */
document.body.style.overscrollBehavior = "none";
