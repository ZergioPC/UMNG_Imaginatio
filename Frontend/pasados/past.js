let gallery = document.getElementById('galle')
let imgs = gallery.querySelectorAll('img')
const contentido = document.getElementById("content")
let draggin = false, mouseLocation, galleryLocation, hasMoved = false;
const images = gallery.querySelectorAll('img');
images.forEach(img => {
    img.draggable = false;
});

const imaginatios = [
    {
        year: 2014,
        title: "Imaginatio I",
        description: "Imaginatio 2014-1 es la primera instancia del evento Imaginatio realizada en la sede del Campus de la UMNG.<br>El tema es la ingeniería en sí misma, con charlas sobre producción y renderizado de video.",
    },
    {
        year: 2014,
        title: "Imaginatio II",
        description: "Imaginatio 2014-2 es la segunda aparición del evento.<br>Esta edición está enfocada en un lado más artístico, con charlas sobre modelado 3D y animación, usando algunas series como ejemplo."
    },
    {
        year: 2015,
        title: "Imaginatio III",
        description: "El Imaginatio de 2015-1 fue la tercera instancia de este evento.<br>Esta edición estuvo dirigida a un aspecto más artístico, con enfoque en animación y series animadas, con charlas sobre conceptos de animación y talleres sobre el mismo tema."
    },
    {
        year: 2015,
        title: "Imaginatio IV",
        description: "El cuarto Imaginatio, el de 2015-2, fue una edición más abierta, con temas como programación y charlas que iban desde concept art hasta renderizado 3D."
    },
    {
        year: 2016,
        title: "Imaginatio V",
        description: "El primer Imaginatio de 2016, el quinto en general, trajo temas más serios como la industria y el profesionalismo. También es la primera edición en tener la Geek Race."
    },
    {
        year: 2016,
        title: "Imaginatio VI",
        description: "En el segundo Imaginatio de 2016 se dio una colaboración especial entre la UMNG y la Universidad de Buenaventura.<br>Incluyó charlas de exalumnos y otros profesionales de la industria."
    },
    {
        year: 2017,
        title: "Imaginatio VII",
        description: "Imaginatio número VII, el primero de 2017.<br>Tuvo un enfoque principal en modelado 3D, con un taller de creación de conceptos de personajes y su posterior modelado en 3D. Los resultados son visibles en la sección de Google Sites de este Imaginatio."
    },
    {
        year: 2018,
        title: "Imaginatio IX",
        description: "El noveno Imaginatio trae un tema más ecológico.<br>Incluye charlas sobre cómo esta carrera de ingeniería puede ayudar en aspectos como la producción de alimentos.<br>También se realizó el primer torneo de fútbol del evento."
    },
    {
        year: 2018,
        title: "Imaginatio X",
        description: "Imaginatio número 10 fue la última edición de los Imaginatio semestrales, pero aun así trajo temas interesantes a la mesa.<br>Con ideas como monetización del trabajo y networking. También hubo nuevos torneos de videojuegos como LoL y Fortnite."
    },
    {
        year: 2019,
        title: "Imaginatio XI",
        description: "Imaginatio XI regresa a algunos temas básicos de nuestra carrera, como Diseño y Fotografía.<br>Incluye no solo una competencia de fotografía que resulta un deleite visual, sino también una Certificación de Alta Calidad otorgada por el Gobierno."
    },
    {
        year: 2020,
        title: "Imaginatio XII",
        description: "El undécimo Imaginatio recibió un título especial: El Día de la Ingeniería Multimedia.<br>Se presentaron una gran variedad de charlas de todos los aspectos que hacen única esta carrera, desde programación hasta arte, desde lo práctico hasta lo teórico."
    },
    {
        year: 2022,
        title: "Imaginatio XIV",
        description: "En el Imaginatio de 2022, el número 14, se abordó un tema emergente: los metaversos y las distintas formas de realidad virtual/aumentada.<br>Se presentaron drones, NFTs y múltiples trabajos realizados por estudiantes, y todo cerró con un concierto de The Black Rope."
    }
];


function show(n){
    const contentImg = contentido.querySelector('img');
    const contentH1 = contentido.querySelector('h1');
    const contentP = contentido.querySelector('p');
    
    if (contentido.style.display === 'flex') {
        contentImg.style.opacity = '0';
        contentH1.style.opacity = '0';
        contentP.style.opacity = '0';
        
        setTimeout(() => {
            contentH1.textContent = imaginatios[n].title;
            contentP.innerHTML = imaginatios[n].description;
            contentImg.src = imgs[n].src;
            
            contentImg.style.opacity = '1';
            contentH1.style.opacity = '1';
            contentP.style.opacity = '1';
        }, 300);
    } else {
        gallery.style.transition = 'height 0.3s';
        gallery.style.height = '50vh';
        contentido.style.display = "flex";
        
        imgs.forEach(img => {
            img.style.height = '350px';
        });
        
        contentH1.textContent = imaginatios[n].title;
        contentP.innerHTML = imaginatios[n].description;
        contentImg.src = imgs[n].src;
        
        contentImg.style.opacity = '0';
        contentH1.style.opacity = '0';
        contentP.style.opacity = '0';
        
        setTimeout(() => {
            contentImg.style.opacity = '1';
            contentH1.style.opacity = '1';
            contentP.style.opacity = '1';
        }, 10);
    }
}

const dragStart = e => {
    draggin = true;
    hasMoved = false;
    mouseLocation = e.pageX;
    galleryLocation = gallery.scrollLeft;
}

const dragActive = e => {
    if (!draggin) return;
    
    let offset = e.pageX - mouseLocation;
    
    if (Math.abs(offset) > 5) { 
        hasMoved = true;
        e.preventDefault();
        gallery.style.pointerEvents = 'none';
    }
    
    gallery.scrollLeft = galleryLocation - offset;
}

const dragStop = e => {
    gallery.style.pointerEvents = 'auto';
    draggin = false;
    
    if (!hasMoved) {
    }
}

gallery.addEventListener('mousedown', dragStart);
gallery.addEventListener('mousemove', dragActive);
gallery.addEventListener('mouseup', dragStop);
gallery.addEventListener('mouseleave', dragStop);

images.forEach((img, n) => {
    img.addEventListener('click', (e) => {
        if (!hasMoved) {
            show(n);
        }
    });
});

document.addEventListener('click', (e) => {
    if (contentido.style.display === 'flex' && 
        !contentido.contains(e.target) && 
        !gallery.contains(e.target)) {
        contentido.style.display = 'none';
        imgs.forEach(img => {
            img.style.height = '';
        });
        gallery.style.height = '';
    }
});