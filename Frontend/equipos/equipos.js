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

// Modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('memberModal');
    const closeBtn = document.querySelector('.close-modal');
    const integrantes = document.querySelectorAll('.integrante');

    // Data for each team member - update with real information
    const memberData = {
        '3.png': {
            name: 'Estudiante Nombre 1',
            role: 'Rol 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et erat sodales velit eleifend mollis sed egestas nisl.'
        },
        '2.png': {
            name: 'Estudiante Nombre 2',
            role: 'Rol 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et erat sodales velit eleifend mollis sed egestas nisl.'
        },
        '1.png': {
            name: 'Estudiante Nombre 3',
            role: 'Rol 3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et erat sodales velit eleifend mollis sed egestas nisl.'
        },
        '6.png': {
            name: 'Estudiante Nombre 4',
            role: 'Rol 4',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et erat sodales velit eleifend mollis sed egestas nisl.'
        }
    };

    // Open modal on integrante click
    integrantes.forEach(integrante => {
        integrante.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.src.split('/').pop(); // Get just the filename
            const data = memberData[imgSrc];

            if(data) {
                document.getElementById('modalMemberImage').src = img.src;
                document.getElementById('modalMemberName').textContent = data.name;
                document.getElementById('modalMemberRole').textContent = data.role;
                document.getElementById('modalMemberDescription').textContent = data.description;
                modal.classList.add('active');
            }
        });
        integrante.style.cursor = 'pointer';
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if(e.target === modal) {
            modal.classList.remove('active');
        }
    });
});