let currentSlide = 1;       // Slide del Banner
const totalSlides = 5;      // Slides totales del Banner
const slideInterval = 5000; // Tiempo decada slide en ms

let currentPage = 0;    // Página actual de posts
const totalPages = 5;   // Total de páginas de posts

const $PostContainer = document.getElementById("posts-container");

const API = "http://192.168.0.21:8000";

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

// MARK: Dibujar Posts

/**
 * 
 * @param {string} titulo 
 * @param {string} desc 
 * @param {string} img 
 * @param {number} likes 
 * @returns {Element} post
 */
function createPost(titulo,desc,img,likes) {
    const post = document.createElement("article");
    post.className = "post";

    const postHeader = document.createElement("header");
    const postMain = document.createElement("main");
    const postFooter = document.createElement("footer");
    
    postHeader.className = "post-header";
    postMain.className = "post-main";
    postFooter.className = "post-footer";

    const teamImg = document.createElement("img");
    teamImg.src = "";

    const title = document.createElement("h2");
    title.innerText = titulo;

    postHeader.appendChild(teamImg);
    postHeader.appendChild(title);

    const description = document.createElement("p");
    description.innerText = desc;

    const mainImg = document.createElement("img");
    mainImg.src = `${API}/${img}`;

    postMain.append(description);
    postMain.append(mainImg);

    const likesCount = document.createElement("button");
    likesCount.innerText = `${likes} ❤️`

    postFooter.append(likesCount);

    post.appendChild(postHeader);
    post.appendChild(postMain);
    post.appendChild(postFooter);

    return post;
}

function appendPostContainer(posts){
    $PostContainer.innerHTML = "";
    posts.forEach(data =>{
        console.log(data)
        const post = createPost(
            data.title,
            data.desc,
            data.img,
            data.likes
        );
        $PostContainer.appendChild(post);
    });
}

fetch(API + `/post/pages/${currentPage}`)
.then(res => {
    if(!res.ok){
        throw new Error("No es posible cargar los posts");
    }
    return res.json()
})
.then(data => {       
    appendPostContainer(data.data);
})
.catch(error => {
    console.error('Error:', error);
});