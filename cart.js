const cartContainer = document.getElementById("cartContainer");
const totalEl = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML =
      "<p style='text-align:center'>Your cart is empty</p>";
    totalEl.innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartContainer.innerHTML += `
      <div class="pro" style="display:flex;align-items:center;gap:16px;">
        <img src="${item.image}" style="width:90px;border-radius:12px;">
        
        <div class="des" style="flex:1;">
          <h5>${item.name}</h5>
          <p>$${item.price}</p>

          <div class="qty-box">
            <button onclick="decreaseQty(${index})">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${index})">+</button>
          </div>
        </div>

        <button onclick="removeItem(${index})"
          style="background:none;border:none;color:red;font-size:16px;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });

  totalEl.innerText = total;
}

function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  renderCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  }
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

renderCart();
