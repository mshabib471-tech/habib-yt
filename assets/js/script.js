// ================== USER INFO ==================
const USER_INFO = {
  time: "November 10, 2025 04:03 PM +06",
  handle: "@habib1577",
  country: "BD"
};
// ===============================================

let selectedPackage = null;
let isDarkMode = false;

// ডার্ক মোড
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
}

// QR কোড
function showPaymentQR() {
  const qr = prompt("bKash বা Nagad নম্বর দিন:", "01868461577");
  if (qr) {
    navigator.clipboard.writeText(qr).then(() => {
      alert(`নম্বর কপি হয়েছে: ${qr}`);
    });
  }
}

// লাইভ চ্যাট
function openLiveChat() {
  window.open(`https://wa.me/8801868461577?text=হ্যালো @habib1577, আমি সাহায্য চাই!`, '_blank');
}

// প্যাকেজ সিলেক্ট
function selectPackage(name, price) {
  selectedPackage = { name, price };
  document.querySelectorAll('.coin-card, .package-card, .accessory-card, .social-card, .service-card').forEach(card => {
    card.classList.remove('selected');
  });
  event.target.closest('.coin-card, .package-card, .accessory-card, .social-card, .service-card').classList.add('selected');

  const bar = document.getElementById('checkout-bar');
  if (bar) {
    document.getElementById('selected-name').textContent = name;
    document.getElementById('selected-price').textContent = price;
    bar.style.display = 'flex';
  }
}

// কিনুন
function proceedToPayment() {
  if (!selectedPackage) return alert('প্যাকেজ সিলেক্ট করুন');
  const user = JSON.parse(localStorage.getItem('user')) || { phone: 'অজানা' };
  const msg = `নতুন অর্ডার!%0Aপ্যাকেজ: ${selectedPackage.name}%0Aমূল্য: ${selectedPackage.price}%0Aইউজার: ${user.phone || user.email}%0Aসাইট: ${USER_INFO.handle}`;
  window.open(`https://wa.me/8801868461577?text=${msg}`, '_blank');

  const order = { id: Date.now(), ...selectedPackage, date: new Date().toLocaleString('bn-BD'), status: 'পেন্ডিং', user: user.phone || user.email };
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  alert('অর্ডার সফল!');
  document.getElementById('checkout-bar').style.display = 'none';
  selectedPackage = null;
}

// এক্সেসরিজ ক্লিক
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accessory-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.acc-name').textContent;
      window.open(`https://wa.me/8801868461577?text=আমি "${name}" কিনতে চাই। দাম কত? @habib1577`, '_blank');
    });
  });

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    isDarkMode = true;
  }
});