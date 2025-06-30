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

// Lógica del Carrusel
const track = document.getElementById('carouselTrack');
let allImages = []; // Almacenará todas las imágenes del carrusel, incluyendo clones
let currentIndex = 0; // Índice de la imagen visible actualmente

function setupCarousel() {
    const originalImages = Array.from(track.querySelectorAll('img'));
    const originalImagesCount = originalImages.length;

    // Si no hay imágenes, no hacemos nada
    if (originalImagesCount === 0) {
        console.warn("No hay imágenes en el carrusel.");
        return;
    }

    // Limpiar el track antes de añadir los clones para evitar duplicados si se llama varias veces
    track.innerHTML = '';

    // Añadir clones al principio para el bucle infinito (las últimas 2 imágenes)
    for (let i = 0; i < 2; i++) {
        const clone = originalImages[originalImagesCount - 2 + i].cloneNode(true);
        track.appendChild(clone);
    }

    // Añadir imágenes originales
    originalImages.forEach(img => track.appendChild(img));

    // Añadir clones al final para el bucle infinito (las primeras 2 imágenes)
    for (let i = 0; i < 2; i++) {
        const clone = originalImages[i].cloneNode(true);
        track.appendChild(clone);
    }

    // Ahora, obtener todas las imágenes en el track (originales + clones)
    allImages = Array.from(track.querySelectorAll('img'));
    const totalImages = allImages.length; // Por ejemplo, 4 originales + 4 clones = 8 imágenes

    // El currentIndex inicial debe ser el de la primera imagen original
    // (después de los 2 clones iniciales que pusimos para el efecto)
    currentIndex = 2; // La primera imagen original está en el índice 2

    // Ajustar el ancho del track para que cada imagen ocupe el 100% de la vista
    track.style.width = `${totalImages * 100}%`; // Por ejemplo, 800% si hay 8 imágenes

    // Función para actualizar la posición del carrusel
    function updateCarousel(instant = false) {
        const transformValue = currentIndex * (100 / totalImages);

        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 1s ease-in-out';
        }
        track.style.transform = `translateX(-${transformValue}%)`;

        if (instant) {
            // Forzar un "repaint" después de un salto instantáneo
            track.offsetWidth;
            track.style.transition = 'transform 1s ease-in-out';
        }
    }

    // Función para avanzar el carrusel automáticamente
    function autoSlide() {
        currentIndex++;
        updateCarousel();

        // Detectar si estamos en un clon al final del carrusel
        // y saltar instantáneamente a la imagen original correspondiente
        if (currentIndex >= totalImages - 2) { // Si estamos en los últimos 2 clones
            setTimeout(() => {
                currentIndex = 2; // Saltar de vuelta a la primera imagen original (índice 2)
                updateCarousel(true); // Actualizar la posición sin transición
            }, 1000); // Esperar la duración de la transición antes de saltar
        }
    }

    // Inicializar el carrusel en la posición correcta (primera imagen original)
    // sin animación al cargar la página
    updateCarousel(true);

    // Iniciar el avance automático
    setInterval(autoSlide, 5000);
}

// Asegurarse de que el DOM esté completamente cargado antes de configurar el carrusel
window.addEventListener('load', setupCarousel);

// Lógica del Formulario de Contacto
const contactForm = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const thankYouMessage = document.getElementById('thankYouMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const formspreeUrl = 'https://formspree.io/f/xwpbayog'; // <--- ¡CAMBIA ESTO!

        try {
            const response = await fetch(formspreeUrl, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                contactForm.reset();
                thankYouMessage.textContent = '¡Gracias por ponerte en contacto con nosotros!';
                thankYouMessage.style.display = 'inline';
                setTimeout(() => {
                    thankYouMessage.style.display = 'none';
                    thankYouMessage.textContent = '';
                }, 5000);
            } else {
                thankYouMessage.textContent = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
                thankYouMessage.style.color = 'red';
                thankYouMessage.style.display = 'inline';
                console.error('Error al enviar formulario:', response.statusText);
            }
        } catch (error) {
            thankYouMessage.textContent = 'Error de conexión. Por favor, revisa tu internet e inténtalo de nuevo.';
            thankYouMessage.style.color = 'red';
            thankYouMessage.style.display = 'inline';
            console.error('Error de red:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensaje';
        }
    });
}