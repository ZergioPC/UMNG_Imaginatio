//const API = "http://192.168.0.21:8000";
const API = "http://127.0.0.1:8000";
//const API = "http://10.0.211.231:8000";

/**
 * Dibuja el Header
 */
function loadHeader(){
    const $header = document.getElementById('header');
    // Create header-menu container
    const headerMenu = document.createElement("div");
    headerMenu.className = "header-menu";

    // Label for burger menu
    const burgerLabel = document.createElement("label");
    burgerLabel.className = "ham_menu";
    burgerLabel.setAttribute("for", "menu-burger-btn");

    // Three spans
    for (let i = 0; i < 3; i++) {
        const span = document.createElement("span");
        burgerLabel.appendChild(span);
    }

    // Button inside label
    const burgerBtn = document.createElement("button");
    burgerBtn.id = "menu-burger-btn";
    burgerBtn.textContent = "Menu Nav";
    burgerLabel.appendChild(burgerBtn);

    headerMenu.appendChild(burgerLabel);

    // Title
    const title = document.createElement("h1");
    const titleLink = document.createElement("a");
    titleLink.href = "/";
    titleLink.textContent = "Imaginatio";
    title.appendChild(titleLink);

    headerMenu.appendChild(title);

    // ---- SECOND BLOCK: ACCOUNT MENU ----

    // Label for account menu
    const accountLabel = document.createElement("label");
    accountLabel.className = "header-account";
    accountLabel.setAttribute("for", "menu-account-btn");

    // REPLACE SVG WITH IMAGE
    const img = document.createElement("img");
    img.className = "user";
    img.src = "/images/Global_Icons/user-svgrepo-com.png";
    img.alt = "User Icon";
    accountLabel.appendChild(img);

    // Button for account menu
    const accountBtn = document.createElement("button");
    accountBtn.id = "menu-account-btn";
    accountBtn.textContent = "Menu Account";
    accountLabel.appendChild(accountBtn);

    // Append everything to body (or wherever you need it)
    $header.appendChild(headerMenu);
    $header.appendChild(accountLabel);
}

/**
 * Dibuja el Footer
 */
function loadFooter(){
    const $footer = document.getElementById('footer');
    // ---------- FOOTER EXT UMNG ----------
    const footerExtUmng = document.createElement("div");
    footerExtUmng.className = "footer-ext-umng";

    const umngImg = document.createElement("img");
    umngImg.src = "../images/Global_Icons/umng_escudo.png";
    footerExtUmng.appendChild(umngImg);


    // ---------- FOOTER EXT INFO ----------
    const footerExtInfo = document.createElement("div");
    footerExtInfo.className = "footer-ext-info";

    const ul = document.createElement("ul");

    const li1 = document.createElement("li");
    const h4 = document.createElement("h4");
    h4.textContent = "Sede Campus Nueva Granada";
    li1.appendChild(h4);

    const li2 = document.createElement("li");
    li2.textContent = "kilómetro 2, vía Cajicá-Zipaquirá.";

    const li3 = document.createElement("li");
    li3.textContent = "Lunes a viernes, de 8:00 a.m. a 5:00 p.m.";

    const li4 = document.createElement("li");

    const li4_a = document.createElement("a");
    li4_a.href = "sites.google.com/unimilitar.edu.co/multimedia/ingeniería-en-multimedia"; 
    li4_a.textContent = "Página web oficial de la carrera";
    li4.appendChild(li4_a);

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    footerExtInfo.appendChild(ul);


    // ---------- FOOTER CONTENT ----------
    const footerContent = document.createElement("div");
    footerContent.className = "footer-content";

    // Social container
    const socialDiv = document.createElement("div");
    socialDiv.className = "footer_social";

    // Replace SVG icons with images
    const icons = [
        { class: "icon_instagram", src: "/images/Global_Icons/social_ig.png"},
        { class: "icon_www",       src: "/images/Global_Icons/internet-svgrepo-com.png"},
        { class: "icon_twt",       src: "/images/Global_Icons/social_twitch.png"},
        { class: "icon_yt",        src: "/images/Global_Icons/social_yt.png"},
        { class: "icon_fb",        src: "/images/Global_Icons/social_fb.png"}
    ];

    icons.forEach(icon => {
        const img = document.createElement("img");
        img.className = `icon ${icon.class}`;
        img.src = icon.src;      // replace with the actual path of your icons
        img.alt = icon.class;
        socialDiv.appendChild(img);
    });

    footerContent.appendChild(socialDiv);

    // Copyright text
    const footerText = document.createElement("div");
    footerText.textContent = "2025 Gatillo Crew - Ingeniería Multimedia ©";
    footerContent.appendChild(footerText);


    // ---------- Append all to body ----------
    $footer.appendChild(footerExtUmng);
    $footer.appendChild(footerExtInfo);
    $footer.appendChild(footerContent);

}

/**
 * Dibuja el menu de Login
 */
function loadAsideAccount(){
    if (!document.getElementById("menuAccount")){
        return
    }
    const $menuAccount = document.getElementById("menuAccount");
    // Create Log In button
    const btnLogin = document.createElement("button");
    btnLogin.id = "accountBtn1";
    btnLogin.className = "account-login-btn";
    btnLogin.textContent = "Log In";

    // Create Close button
    const btnClose = document.createElement("button");
    btnClose.id = "accountBtnClose";
    btnClose.className = "acount-close-btn";
    btnClose.textContent = "Cerrar";

    // Append to body (or any container you want)
    $menuAccount.appendChild(btnLogin);
    $menuAccount.appendChild(btnClose);
}

/**
 * Dibuja el menu de Equipo Logeado
 */
function loadAsideLogged(){
    if (!document.getElementById("menuAccount")){
        return
    }

    const $menuAccount = document.getElementById("menuAccount");
    // Create Img
    const img = document.createElement("img");
    img.id = "account-img";
    img.alt = "Foto de Perfil";

    const h3 = document.createElement("h3");
    h3.id = "temaName";

    // Create Register button
    const btnPanel = document.createElement("button");
    btnPanel.id = "panelBtn";
    btnPanel.className = "account-signin-btn";
    btnPanel.textContent = "Panel de Equipo";

    // Create Close button
    const btnClose = document.createElement("button");
    btnClose.id = "accountBtnClose";
    btnClose.className = "acount-close-btn";
    btnClose.textContent = "Cerrar";

    // Append to body (or any container you want)    
    $menuAccount.appendChild(h3);
    $menuAccount.appendChild(img);
    $menuAccount.appendChild(btnPanel);
    $menuAccount.appendChild(btnClose);
}

/**
 * Dibuja el Menu del sitio web
 */
function loadAsideBurger(){
    if(!document.getElementById("menuHamb")){
        return
    }
    
    const $menuHamb = document.getElementById("menuHamb");
    // Create <nav>
    const nav = document.createElement("nav");

    // Link data
    const links = [
        { href: "/pet/", text: "Mascota" },
        { href: "/about/", text: "Quienes Somos" },
        { href: "/eventos/", text: "Concursos" },
        { href: "/pasados/", text: "Eventos Pasados" },
        { href: "/actual/", text: "Edición 2026" }
    ];

    // Create and append links
    links.forEach(linkInfo => {
        const a = document.createElement("a");
        a.href = linkInfo.href;
        a.textContent = linkInfo.text;
        nav.appendChild(a);
    });

    // Append to body (or wherever needed)
    $menuHamb.appendChild(nav);
}

/**
 * Configura el Menu del sitio web
 */
function setUpHamburger(){
    if(!document.getElementById("menuHamb")){
        return
    }
    
    const $menuHamSpan = document.querySelector('#header .ham_menu');
    const $menuHamAside = document.getElementById("menuHamb");
    const $menuHamBtn =  document.getElementById("menu-burger-btn");

    $menuHamBtn.addEventListener("click", ()=>{
        $menuHamSpan.classList.toggle('active');
        $menuHamAside.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    $menuHamAside.addEventListener("click", ()=>{
        $menuHamSpan.classList.remove('active');
        $menuHamAside.classList.remove('active');
    });
}

/**
 * Configura el Menu de Loggin
 */
function setUpAccount(){
    if(!document.getElementById('menuAccount')){
        return
    }

    const loginDropdown = document.getElementById('menuAccount');
    const acountBtn = document.getElementById('menu-account-btn');
    const closeBtn = document.getElementById('accountBtnClose');
    const loginBtn = document.getElementById('accountBtn1');
    
    if(!acountBtn || !loginDropdown) return;
    
    // Toggle dropdown on user icon click
    acountBtn.addEventListener('click', () => {
        loginDropdown.classList.add("active");
    });

    closeBtn.addEventListener('click',()=>{
        loginDropdown.classList.remove('active');
    });
    
    loginBtn.addEventListener('click',()=>{
        window.location.href = "/equipos/login.html"
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if(!acountBtn.contains(e.target) && !loginDropdown.contains(e.target)){
            loginDropdown.classList.remove('active');
        }
    });
}

/**
 * Configura el Menu de Equipo Logeado
 */
function setUpAccountLogged(team){   
    if (!document.getElementById("menuAccount")){
        return
    }
    console.log(team);
    
    const loginDropdown = document.getElementById('menuAccount');
    const acountBtn = document.getElementById('menu-account-btn');
    const closeBtn = document.getElementById('accountBtnClose');

    const $name =  document.getElementById("temaName");
    $name.innerText = team.name;

    const $img =  document.getElementById("account-img");
    $img.src =  `${API}/${team.img}` || "src"

    const $btn =  document.getElementById("panelBtn");
    $btn.addEventListener("click",()=>{
        window.location.href = "/equipos/admin.html";
    });

    if(!acountBtn || !loginDropdown) return;
    
    // Toggle dropdown on user icon click
    acountBtn.addEventListener('click', () => {
        loginDropdown.classList.add("active");
    });

    closeBtn.addEventListener('click',()=>{
        loginDropdown.classList.remove('active');
    });
    

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if(!acountBtn.contains(e.target) && !loginDropdown.contains(e.target)){
            loginDropdown.classList.remove('active');
        }
    });
}

/**
 * Dibuja el FAVICON
 */
function setUpFavicon() {
    let favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');

    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }

    favicon.href = "/images/Global_Icons/logo_gatillo_crew.png";
}

function checkUserCookie(){    
    fetch(API + "/equipo/healty", {
        method: 'GET',
        credentials:"include"
    })
    .then(response => response.json())
    .then(data => {            
        if(data.message){
            loadAsideLogged();
            setUpAccountLogged(data.data[0]);
        }else{
            loadAsideAccount();
            setUpAccount();
        }
    })
    .catch(error => {
        console.error('Errora:', error);
    });
}

//Llamado a las funciones

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    checkUserCookie();
    loadAsideBurger();
    setUpHamburger();
    setUpFavicon()
});
