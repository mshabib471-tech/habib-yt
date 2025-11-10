let selectedPackage = null;

function selectPackage(name, price) {
  selectedPackage = { name, price };
  document.querySelectorAll('.package-card').forEach(c => c.style.border = '2px solid transparent');
  event.target.closest('.package-card').style.border = '2px solid #4361ee';
  const bar = document.getElementById('checkout-bar');
  if (bar) {
    document.getElementById('selected-name').textContent = name;
    document.getElementById('selected-price').textContent = ${price}৳;
    bar.style.display = 'flex';
  }
}

function proceedToPayment() {
  if (!selectedPackage) return alert('প্যাকেজ সিলেক্ট করুন');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) { alert('লগইন করুন!'); window.location.href = 'login.html'; return; }
  const msg = অর্ডার: ${selectedPackage.name} - ${selectedPackage.price}৳%0Aইউজার: ${user.email || user.phone};
  window.open(https://wa.me/8801868461577?text=${msg}, '_blank');

  const order = { id: Date.now(), ...selectedPackage, date: new Date().toLocaleString('bn-BD'), status: 'পেন্ডিং' };
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert('অর্ডার সফল!');
  document.getElementById('checkout-bar').style.display = 'none';
}
let selectedPackage = null;

function selectPackage(name, price) {
  selectedPackage = { name, price };
  document.querySelectorAll('.coin-card').forEach(c => c.classList.remove('selected'));
  event.target.closest('.coin-card').classList.add('selected');

  const bar = document.getElementById('checkout-bar');
  document.getElementById('selected-name').textContent = name;
  document.getElementById('selected-price').textContent = ${price} TK;
  bar.style.display = 'flex';
}

function proceedToPayment() {
  if (!selectedPackage) return alert('প্যাকেজ সিলেক্ট করুন');
  
  const user = JSON.parse(localStorage.getItem('user')) || { phone: 'অজানা' };
  const msg = নতুন অর্ডার!%0Aপ্যাকেজ: ${selectedPackage.name}%0Aমূল্য: ${selectedPackage.price} TK%0Aইউজার: ${user.phone || user.email}%0Aসাইট: @habib1577;
  window.open(https://wa.me/8801868461577?text=${msg}, '_blank');

  const order = { id: Date.now(), ...selectedPackage, date: new Date().toLocaleString('bn-BD'), status: 'পেন্ডিং' };
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert('অর্ডার সফল! @habib1577 কে WhatsApp-এ মেসেজ করুন।');
  document.getElementById('checkout-bar').style.display = 'none';
}

// ক্লিক করলে WhatsApp-এ মেসেজ
document.querySelectorAll('.accessory-card').forEach(card => {
  card.addEventListener('click', function() {
    const name = this.querySelector('.acc-name').textContent;
    const msg = আমি "${name}" কিনতে চাই। দাম কত? @habib1577;
    window.open(https://wa.me/8801868461577?text=${encodeURIComponent(msg)}, '_blank');
  });
});
