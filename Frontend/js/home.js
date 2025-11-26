let currentSlide = 1;       // Slide del Banner
const totalSlides = 5;      // Slides totales del Banner
const slideInterval = 5000; // Tiempo decada slide en ms

let currentPage = 0;    // Página actual de posts
let totalPages = 5;   // Total de páginas de posts

const $prevBtn = document.getElementById('prev-btn');
const $nextBtn = document.getElementById('next-btn');

const $PostContainer = document.getElementById("posts-container");

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
    currentPage = pageNum;
    updatePagination();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePagination() {
    // Update Previous button
    $prevBtn.disabled = currentPage === 0;
    
    // Update Next button
    $nextBtn.disabled = currentPage === totalPages - 1;
    
    // Update page numbers
    const pageNumbersContainer = document.getElementById('page_numbers');
    pageNumbersContainer.innerHTML = '';
    
    // Determine start index to render up to 3 page buttons
    let startIndex = 0;
    if (totalPages <= 3) {
        startIndex = 0;
    } else if (currentPage === 0) {
        startIndex = 0;
    } else if (currentPage === totalPages - 1) {
        startIndex = totalPages - 3;
    } else {
        // center current page when possible
        startIndex = currentPage - 1;
    }

    const endIndex = Math.min(startIndex + 3, totalPages); // exclusive

    for (let i = startIndex; i < endIndex; i++) {
        const pageBtn = document.createElement('span');
        pageBtn.className = 'page_number';
        pageBtn.textContent = i + 1;
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', () => showPage(i));
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    // Update page info
    document.getElementById('page-info').textContent = `Page ${currentPage+1} of ${totalPages}`;
}

// Event listeners
$prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        showPage(currentPage - 1);
        fetchData();
    }
});

$nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
        fetchData();
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
function createPost(titulo,desc,img,avatar,likes,id) {
    const post = document.createElement("article");
    post.className = "post";

    const postHeader = document.createElement("header");
    const postMain = document.createElement("main");
    const postFooter = document.createElement("footer");
    
    postHeader.className = "post-header";
    postMain.className = "post-main";
    postFooter.className = "post-footer";

    const teamImg = document.createElement("img");
    teamImg.src = `${API}/${avatar}`;;

    const title = document.createElement("h2");
    title.innerText = titulo;

    postHeader.appendChild(teamImg);
    postHeader.appendChild(title);

    const description = document.createElement("p");
    description.innerText = desc;

    const mainImg = document.createElement("img");
    mainImg.src = `${API}/${img}`;

    postMain.append(mainImg);
    
    const likesCount = document.createElement("button");

    const likesData = document.createElement("span");
    likesData.innerText = likes;

    const likesImg = document.createElement("img");
    likesImg.src = "images/Global_Icons/heart-empty-svgrepo-com.png";

    likesCount.setAttribute("isLiked","false");
    likesCount.addEventListener("click",()=>{
        if(likesCount.getAttribute("isLiked") === "true") return;
        
        fetch(`${API}/post/like/${id}`,{method: 'PATCH'})
        .then(res => {
            if(!res.ok){
                throw new Error("No se ha dado like");
            }
            return res.json()
        })
        .then(data => {       
            alert(data.data);
            likesCount.setAttribute("isLiked","true");
            likesImg.src = "images/Global_Icons/heart-svgrepo-com.png"; 
            savePetData()           
        })
        .catch(error => {
            console.log(`${API}/post/like/${id}`);
            
            console.error('Error:', error);
        });
    });

    likesCount.appendChild(likesImg);
    likesCount.appendChild(likesData);
    
    postFooter.append(description);
    postFooter.append(likesCount);

    post.appendChild(postHeader);
    post.appendChild(postMain);
    post.appendChild(postFooter);

    return post;
}

function appendPostContainer(posts){
    $PostContainer.innerHTML = "";
    posts.forEach(data =>{        
        const post = createPost(
            data.title,
            data.desc,
            data.img,
            data.equipo_img,
            data.likes,
            data.post_id
        );
        $PostContainer.appendChild(post);
    });
}

function savePetData(){
    const pet = JSON.parse(localStorage.getItem("Imaginatio_petData"));
    if (!pet){
    }else{
        pet.userLikes += 10;
    }

    const petJson = JSON.stringify(pet);
    localStorage.setItem("Imaginatio_petData",petJson)
}

function fetchData(){
    fetch(API + `/post/pages/${currentPage}`)
    .then(res => {
        if(!res.ok){
            throw new Error("No es posible cargar los posts");
        }
        return res.json()
    })
    .then(data => {       
        totalPages = data.pages;
        updatePagination();
        appendPostContainer(data.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    fetchData();
});