import API from "../../js/config.js";

const urlParams = new URLSearchParams(window.location.search);
const TEAM_ID = urlParams.get('team'); 

let currentPage = 0;
let totalPages = 3;

const $prevBtn = document.getElementById('prev-btn');
const $nextBtn = document.getElementById('next-btn');

const $PostContainer = document.getElementById("posts-container");
const $TitleSection = document.getElementById("info-equipo");

function drawTitles(equipo){
    const h1 = document.createElement("h1");
    h1.innerText = equipo.publicName || "Nombre del Equipo";

    const p = document.createElement("p");
    p.innerText = equipo.desc || "Descripcion";

    $TitleSection.appendChild(h1);
    $TitleSection.appendChild(p);
}


// MARK: Modal
const $modal = document.getElementById("modalEstInfo");
const $modalBtn = document.getElementById("modalClose");

$modalBtn.addEventListener("click", () => {  
    $modal.classList.toggle("open");
    $modal.close();
});

function showModalInfo(est){
    $modal.showModal();
    $modal.classList.toggle("open");

    const figure = document.getElementById("modalFigure");
    figure.innerHTML = "";

    const img =  document.createElement("img");
    img.src =  img.src = `${API}/${est.img}`;
    figure.appendChild(img);

    const data = document.getElementById("modalContent");
    data.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerText = est.name ||"Nombre";

    const div = document.createElement("div");

    const span = document.createElement("span");
    span.innerText = est.rol || "Rol";

    div.appendChild(span);

    const p = document.createElement("p");
    p.innerText = est.desc || "Descripcion";

    const ul = document.createElement("ul");

    if(est.email && est.email.length > 0){
        const li = document.createElement("li");
        
        const a = document.createElement("a");
        a.href = `mailto:${est.email}`;
        a.innerText = "Email";
        a.target = "blank";

        const fig =  document.createElement("figure");
        fig.classList.add("global-iconos")

        
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = "/images/Global_Icons/mail-alt-svgrepo-com.png";

        fig.appendChild(icon);

        li.appendChild(fig);
        li.appendChild(a);
        ul.appendChild(li);
    }

    if(est.phone && est.phone.length > 0){
        const li = document.createElement("li");
        
        const a = document.createElement("a");
        a.href = `tel:${est.phone}`;
        a.innerText = est.phone;
        a.target = "blank";

        const fig =  document.createElement("figure");
        fig.classList.add("global-iconos")
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = "/images/Global_Icons/phone-svgrepo-com.png";

        fig.appendChild(icon);

        li.appendChild(fig);
        li.appendChild(a);
        ul.appendChild(li);
    }

    if(est.instagram && est.instagram.length > 0){
        const li = document.createElement("li");
        
        const a = document.createElement("a");
        a.href = `https://www.instagram.com/${est.instagram}`;
        a.innerText = est.instagram;
        a.target = "blank";

        const fig =  document.createElement("figure");
        fig.classList.add("global-iconos")
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = "/images/Global_Icons/social_ig.png";

        fig.appendChild(icon);

        li.appendChild(fig);
        li.appendChild(a);
        ul.appendChild(li);
    }

    if(est.tiktok && est.tiktok.length > 0){
        const li = document.createElement("li");
        
        const a = document.createElement("a");
        a.href = `https://www.tiktok.com/${est.tiktok}`;
        a.innerText = est.tiktok;
        a.target = "blank";

        const fig =  document.createElement("figure");
        fig.classList.add("global-iconos")
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = "/images/Global_Icons/social_tiktok.png";

        fig.appendChild(icon);

        li.appendChild(fig);
        li.appendChild(a);
        ul.appendChild(li);
    }

    if(est.twiter && est.twiter.length > 0){
        const li = document.createElement("li");
        
        const a = document.createElement("a");
        a.href = `https://www.x.com/${est.twiter}`;
        a.innerText = est.twiter;
        a.target = "blank";

        const fig =  document.createElement("figure");
        fig.classList.add("global-iconos")
        const icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = "/images/Global_Icons/social_twiter.png";

        fig.appendChild(icon);

        li.appendChild(fig);
        li.appendChild(a);
        ul.appendChild(li);
    }
    
    data.appendChild(h3);
    data.appendChild(div);
    data.appendChild(p);
    data.appendChild(ul);
    //console.log(est);
}

// MARK: Dibujar Posts

/**
 * 
 * @param {string} titulo 
 * @param {string} desc 
 * @param {string} img 
 * @param {number} likes 
 * @returns {Element} post
 */
function createPost(titulo,desc,img,avatar,likes) {
    const post = document.createElement("article");
    post.className = "post";

    const postHeader = document.createElement("header");
    const postMain = document.createElement("main");
    const postFooter = document.createElement("footer");
    
    postHeader.className = "post-header";
    postMain.className = "post-main";
    postFooter.className = "post-footer";

    const teamImg = document.createElement("img");
    teamImg.src = `${API}/${avatar}`;

    const title = document.createElement("h2");
    title.innerText = titulo;

    postHeader.appendChild(teamImg);
    postHeader.appendChild(title);

    const description = document.createElement("p");
    description.innerText = desc;

    const mainImg = document.createElement("img");
    mainImg.src = `${API}/${img}`;

    postMain.append(mainImg);
    
    postFooter.append(description);

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
            data.likes
        );
        $PostContainer.appendChild(post);
    });
}


// MARK: Dibujar Usuarios

function dibujarIntegrantes(lista){
    const container = document.getElementById("integrantes");
    lista.forEach(est =>{
        const id_name = `est-btn-${est.est_id}`

        const h3 = document.createElement("h3");   
        h3.innerText = est.name;    

        const figure =  document.createElement("figure");

        const img = document.createElement("img");
        img.src = `${API}/${est.img}`;

        figure.appendChild(img);

        const span = document.createElement("span");
        span.innerText = "Rol";
        
        const btn = document.createElement("button");
        btn.innerText = "_";
        btn.id = id_name;

        btn.addEventListener("click", ()=>{
            showModalInfo(est);
        });

        const label = document.createElement("label");
        label.for = id_name;
        label.classList.add("item");

        label.appendChild(figure);
        label.appendChild(h3);
        label.appendChild(span);
        label.appendChild(btn);

        container.appendChild(label);
    });
}


// MARK: Paginator
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
        fetchDataPost();
    }
});

$nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
        fetchDataPost();
    }
});

updatePagination();


// MARK: Fetch Data
function fetchDataPost(){
    fetch(API + `/equipo/publicaciones/${TEAM_ID}/${currentPage}`)
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
        const p = document.createElement("p");
        p.innerText = "No hay publicaciones de este equipo aún"
        $PostContainer.appendChild(p);
    });
}

function fetchDataTeam(){
    fetch(API + `/equipo/get/${TEAM_ID}`)
    .then(res => {
        if(!res.ok){
            throw new Error("No es posible cargar los posts");
        }
        return res.json()
    })
    .then(data => {
        drawTitles(data.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchDataUsers(){
    fetch(API + `/estudiantes/filter/${TEAM_ID}`)
    .then(res => {
        if(!res.ok){
            throw new Error("No es posible cargar los posts");
        }
        return res.json()
    })
    .then(data => {
        dibujarIntegrantes(data.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    fetchDataTeam();
    fetchDataUsers();
    fetchDataPost();
});