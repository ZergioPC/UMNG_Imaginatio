// Carruseles de imagenes
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const images = Array.from(track.children);
    
    // Clone all images and append them for seamless infinite scroll
    images.forEach(img => {
        const clone = img.cloneNode(true);
        track.appendChild(clone);
    });
});

// Grid de muestras
const images = document.querySelectorAll('.muestrasAcademicas img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Optional: Add click event to images
images.forEach(img => {
    img.addEventListener('click', () => {
        console.log('Image clicked:', img.alt);
        // You can add modal or full-screen view here
    });
});

// Botton de ver otros imaginatios
const $aboutBtn = document.getElementById("about-btn");
$aboutBtn.addEventListener("click", ()=>{
    window.location.href = "/pasados/"
});