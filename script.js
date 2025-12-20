/* ================= MOBILE NAVBAR ================= */
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.add("active");
    });
}

if (close) {
    close.addEventListener("click", () => {
        nav.classList.remove("active");
    });
}

/* ================= REAL ADD TO CART ================= */
/*
  Cart system using localStorage
  Safe for your existing HTML
*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// add to cart button (.fa-shopping-cart)
document.querySelectorAll(".fa-shopping-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const product = btn.closest(".pro");

        const img = product.querySelector("img").src;
        const name = product.querySelector("h5").innerText;
        const priceText = product.querySelector("h4").innerText;
        const price = parseFloat(priceText.replace("$", ""));

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                img: img,
                name: name,
                price: price,
                qty: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Product added to cart 🛒");
    });
});

/* ================= CART COUNT (OPTIONAL) ================= */
/*
  If later you add cart count badge
*/
function getCartCount() {
    return cart.reduce((total, item) => total + item.qty, 0);
}
