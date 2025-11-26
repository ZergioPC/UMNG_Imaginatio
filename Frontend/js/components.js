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

function loadAsideAccount(){
    document.getElementById("menuAccount").innerHTML = `
        <button id="accountBtn1" class="account-login-btn">Log In</button>
        <button id="accountBtn2" class="account-signin-btn">Register</button>
        <button id="accountBtnClose" class="acount-close-btn">Cerrar</button>
    `;
}

function loadAsideBurger(){
    document.getElementById("menuHamb").innerHTML = `
    <nav>
        <a href="/pet/">Mascota</a>
        <a href="/about/">Quienes Somos</a>
        <a href="/eventos/">Actividades</a>
        <a href="/pasados/">Eventos Pasados</a>
        <a href="/actual/">Edición 2026</a>
    </nav>
    `;
}


function setUpHamburger(){
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

function setUpAccount(){
    const acountBtn = document.getElementById('menu-account-btn');
    const closeBtn = document.getElementById('accountBtnClose');
    const loginDropdown = document.getElementById('menuAccount');
    
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

// FAVICON
function setUpFavicon() {
    let favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');

    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }

    favicon.href = "/images/Global_Icons/logo_gatillo_crew.png";
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    loadAsideBurger();
    loadAsideAccount();
    setUpHamburger();
    setUpAccount();
    setUpFavicon()
});
