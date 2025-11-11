// Footer year update
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Optional menu alert
document.querySelector(".menu-btn")?.addEventListener("click", () => {
  alert("মেনু ফিচার আসছে শীঘ্রই 🚀");
});
