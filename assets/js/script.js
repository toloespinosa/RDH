// Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const content = document.getElementById("main-content");
  
    setTimeout(() => {
      loader.style.display = "none";
      content.classList.remove("hidden");
    }, 2000);
  });
  
  // Menú hamburguesa
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  let currentIndex = 0;
const images = document.querySelectorAll('.main-image img');
const track = document.getElementById('carouselTrack');
const thumbnails = document.querySelectorAll('.thumbnails img');

function updateCarousel() {
  track.style.transform = `translateX(-${100 * currentIndex}%)`;
  thumbnails.forEach(thumb => thumb.classList.remove('active'));
  thumbnails[currentIndex].classList.add('active');
}

function autoSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

setInterval(autoSlide, 5000);
