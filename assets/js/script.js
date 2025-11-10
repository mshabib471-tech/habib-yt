// ================== USER INFO ==================
const USER_INFO = {
  time: "November 10, 2025 03:22 PM +06",
  handle: "@habib1577",
  country: "BD"
};
// ===============================================

let selectedPackage = null;

// প্যাকেজ সিলেক্ট
function selectPackage(name, price) {
  selectedPackage = { name, price };
  
  document.querySelectorAll('.coin-card, .package-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.coin-card, .package-card').classList.add('selected');

  const bar = document.getElementById('checkout-bar');
  if (bar) {
    document.getElementById('selected-name').textContent = name;
    document.getElementById('selected-price').textContent = ${price} TK;
    bar.style.display = 'flex';
  }
}

// কিনুন বাটন
function proceedToPayment() {
  if (!selectedPackage) {
    alert('প্যাকেজ সিলেক্ট করুন');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user')) || { phone: 'অজানা' };

  const msg = নতুন অর্ডার!%0A +
              প্যাকেজ: ${selectedPackage.name}%0A +
              মূল্য: ${selectedPackage.price} TK%0A +
              ইউজার: ${user.phone || user.email}%0A +
              সাইট: ${USER_INFO.handle}%0A +
              দেশ: ${USER_INFO.country}%0A +
              সময়: ${USER_INFO.time};

  window.open(https://wa.me/8801868461577?text=${msg}, '_blank');

  // অর্ডার সেভ
  const order = { 
    id: Date.now(), 
    ...selectedPackage, 
    date: new Date().toLocaleString('bn-BD'), 
    status: 'পেন্ডিং',
    user: user.phone || user.email,
    site: USER_INFO.handle
  };
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert('অর্ডার সফল! @habib1577 কে WhatsApp-এ মেসেজ করুন।');
  document.getElementById('checkout-bar').style.display = 'none';
  selectedPackage = null;
}

// মোবাইল এক্সেসরিজ ক্লিক
document.querySelectorAll('.accessory-card').forEach(card => {
  card.addEventListener('click', function() {
    const name = this.querySelector('.acc-name').textContent;
    const msg = আমি "${name}" কিনতে চাই। দাম কত?%0A +
                সাইট: ${USER_INFO.handle}%0A +
                দেশ: ${USER_INFO.country};
    window.open(https://wa.me/8801868461577?text=${encodeURIComponent(msg)}, '_blank');
  });
});
