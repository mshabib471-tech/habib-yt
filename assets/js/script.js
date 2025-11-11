// Habib YT Basic Script

// Footer year auto update
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Optional: Menu toggle (future use)
const menuBtn = document.querySelector(".menu-btn");
menuBtn?.addEventListener("click", () => {
  alert("মেনু অপশন আসছে শিগগিরই 🚀");
});