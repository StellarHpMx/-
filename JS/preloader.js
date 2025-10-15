// === UNIVERSAL PRELOADER ===
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  preloader.classList.add("fade-out");
  setTimeout(() => { preloader.style.display = "none"; }, 900);
});
