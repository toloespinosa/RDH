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

// --- Lógica del Carrusel ---
const track = document.getElementById('carouselTrack');
const originalThumbnails = document.querySelectorAll('.thumbnails img'); // Miniaturas de las imágenes originales

const originalImagesCount = 4; // Tienes 4 imágenes originales
const imagesPerView = 3; // Queremos ver 3 imágenes a la vez
const clonedSides = imagesPerView; // Número de clones a cada lado (3 al inicio, 3 al final)

// `currentLogicalIndex` se refiere al índice de la imagen *actual* dentro del conjunto de imágenes ORIGINALES (0 a originalImagesCount - 1).
let currentLogicalIndex = 0; 

// `currentPhysicalPosition` es el índice real de la imagen que estará CENTRADA en el `track` completo (incluyendo clones).
// Inicialmente, queremos centrar la primera imagen original (lógica 0).
// La primera imagen original está en la posición `clonedSides` dentro del track.
// Para que esté centrada, necesitamos que el track se desplace de modo que el punto de inicio de la imagen
// sea `clonedSides - (imagesPerView - 1) / 2`
// Si imagesPerView es 3, (3-1)/2 = 1.
// Entonces, la posición física inicial para centrar la imagen lógica 0 será `clonedSides - 1`.
let currentPhysicalPosition = clonedSides; 

// Obtener TODAS las imágenes en el track (originales + clones)
// Se hace aquí después de que el DOM esté potencialmente cargado, para asegurar que los clones existen.
let allImagesInTrack;

function setupCarousel() {
    allImagesInTrack = document.querySelectorAll('#carouselTrack img'); // Recargar las imágenes si hay cambios dinámicos

    // Calcular el porcentaje que ocupa cada imagen dentro del track completo.
    const percentagePerImage = 100 / allImagesInTrack.length;

    // Función para actualizar la posición del carrusel y las miniaturas
    function updateCarousel(instant = false) {
        // Calcular el valor de transformación para centrar la imagen `currentLogicalIndex`.
        // La imagen `currentLogicalIndex` está en la posición `currentLogicalIndex + clonedSides` en el track.
        // Para centrarla, necesitamos mover el carrusel para que su borde izquierdo
        // se alinee con `currentLogicalIndex + clonedSides - (imagesPerView - 1) / 2`.
        const targetPhysicalPosition = currentLogicalIndex + clonedSides - (imagesPerView - 1) / 2;
        const transformValue = targetPhysicalPosition * percentagePerImage;

        if (instant) {
            track.style.transition = 'none'; // Desactiva la transición para el salto instantáneo
        } else {
            track.style.transition = 'transform 1s ease-in-out'; // Reactiva la transición suave
        }

        track.style.transform = `translateX(-${transformValue}%)`;

        // Actualizar la clase 'active' de las miniaturas.
        originalThumbnails.forEach(thumb => thumb.classList.remove('active'));
        originalThumbnails[currentLogicalIndex].classList.add('active');

        // Forzar un "repaint" y luego reactivar la transición si fue instantáneo.
        if (instant) {
            track.offsetWidth; // Truco para forzar el repaint
            track.style.transition = 'transform 1s ease-in-out'; 
        }
    }

    // Función para avanzar el carrusel automáticamente
    function autoSlide() {
        currentLogicalIndex++; // Avanza el índice de la imagen original

        // Si hemos avanzado más allá de la última imagen original,
        // significa que estamos mostrando uno de los clones de las primeras imágenes.
        if (currentLogicalIndex >= originalImagesCount) {
            // Después de que la animación a la posición del clon termine (1 segundo),
            // reiniciamos `currentLogicalIndex` a 0, haciendo un salto instantáneo.
            setTimeout(() => {
                currentLogicalIndex = 0;
                updateCarousel(true); // Actualiza la posición sin transición
            }, 1000); // Duración de la transición CSS
        }
        updateCarousel(); // Actualiza la posición con transición (si no es un salto instantáneo)
    }

    // Función para ir a una imagen específica (desde las miniaturas)
    function goToSlide(index) {
        currentLogicalIndex = index; // Establece el índice lógico
        updateCarousel(); // Llama a la actualización para posicionar el carrusel
    }

    // Asignar eventos de clic a las miniaturas
    originalThumbnails.forEach((thumb, index) => {
        thumb.onclick = () => goToSlide(index);
    });

    // Inicializar el carrusel
    updateCarousel(true); // Posiciona instantáneamente la primera imagen original en el centro
    setInterval(autoSlide, 5000); // Inicia el avance automático
}

// Asegurarse de que el DOM esté completamente cargado antes de configurar el carrusel
window.addEventListener('load', setupCarousel);

// --- Lógica del Formulario de Contacto ---
const contactForm = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const thankYouMessage = document.getElementById('thankYouMessage');

if (contactForm) { // Asegurarse de que el formulario existe
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el envío por defecto del formulario (recarga de página)

        // Deshabilitar el botón para evitar múltiples envíos
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...'; // Cambiar texto del botón

        // URL de Formspree (REEMPLAZA ESTA URL CON LA TUYA DE FORMSPREE.IO)
        const formspreeUrl = 'https://formspree.io/f/xwpbayog'; // <--- ¡CAMBIA ESTO!

        try {
            const response = await fetch(formspreeUrl, {
                method: 'POST',
                body: new FormData(contactForm), // Recopila todos los datos del formulario
                headers: {
                    'Accept': 'application/json' // Importante para Formspree
                }
            });

            if (response.ok) {
                // Éxito en el envío
                contactForm.reset(); // Borrar los campos del formulario
                thankYouMessage.textContent = '¡Gracias por ponerte en contacto con nosotros!';
                thankYouMessage.style.display = 'inline'; // Mostrar el mensaje
                
                // Ocultar el mensaje después de unos segundos
                setTimeout(() => {
                    thankYouMessage.style.display = 'none';
                    thankYouMessage.textContent = '';
                }, 5000); // Ocultar después de 5 segundos

            } else {
                // Error en el envío
                thankYouMessage.textContent = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
                thankYouMessage.style.color = 'red'; // Color rojo para el error
                thankYouMessage.style.display = 'inline';
                console.error('Error al enviar formulario:', response.statusText);
            }

        } catch (error) {
            // Error de red
            thankYouMessage.textContent = 'Error de conexión. Por favor, revisa tu internet e inténtalo de nuevo.';
            thankYouMessage.style.color = 'red';
            thankYouMessage.style.display = 'inline';
            console.error('Error de red:', error);

        } finally {
            // Volver a habilitar el botón y su texto original
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensaje';
        }
    });
}