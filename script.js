document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const nextBtn = carousel.querySelector('.carousel-btn.right');
  const prevBtn = carousel.querySelector('.carousel-btn.left');

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -300, behavior: 'smooth' });
  });
});

// === BURGER MENU ===
const burger = document.querySelector(".burger-menu");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  navLinks.classList.toggle("active");
});