let currentSlide = 1;
const totalSlides = 5;
const slideInterval = 5000; //Milisegundos

function autoSlide(){
    const radioButton = document.getElementById(getSlideId(currentSlide));
    radioButton.checked = true;

    currentSlide = (currentSlide % totalSlides) + 1;
}

function getSlideId(slideNumber){
    const slideNames = ['one', 'two', 'three', 'four', 'five']
    return slideNames[slideNumber - 1];
}

setInterval(autoSlide, slideInterval);

//Reinicia el temporizador cuando usuario hace click en boton
const labels = document.querySelectorAll(' .sliders laber');
labels.forEach((label, index) => {
    label.addEventListener('click', () => {
        currentSlide = index + 1;
    });  
});


let currentPage = 1;
const totalPages = 5;

function showPage(pageNum) {
    // Hide all content sections
    const sections = document.querySelectorAll('.posts_array');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show the selected page
    const targetSection = document.querySelector(`[data-page="${pageNum}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    currentPage = pageNum;
    updatePagination();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePagination() {
    // Update Previous button
    const prevBtn = document.getElementById('prev-btn');
    prevBtn.disabled = currentPage === 1;
    
    // Update Next button
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = currentPage === totalPages;
    
    // Update page numbers
    const pageNumbersContainer = document.getElementById('page_numbers');
    pageNumbersContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('span');
        pageBtn.className = 'page_number';
        pageBtn.textContent = i;
        
        if (i === currentPage) {
        pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', () => showPage(i));
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    // Update page info
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listeners
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
});

updatePagination();