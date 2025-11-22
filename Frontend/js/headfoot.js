function loadHeader(){
    document.getElementById('header').innerHTML = `
        <div class="off_screen">
            <a href="equipos.html">Usuario</a>
            <a href="pasados.html">Mascota</a>
            <a href="about.html">Quienes Somos</a>
            <a href="eventos.html">Eventos</a>
            <a href="pasados.html">Pasados</a>
        </div>
        
        <div class="ham_menu">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <h1>Imaginatio Page</h1>
        <svg class="user" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"></path> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"></path>
            </g>
        </svg>
        <div id="login-dropdown" class="login-dropdown">
            <button class="login-btn">Log In</button>
            <button class="register-btn">Register</button>
        </div>
    `;
}

function loadFooter(){
    document.getElementById('footer').innerHTML = `
    <div class="foot_info">
        <p>
            <h4>Sede Campus Nueva Granada</h4>
            kilómetro 2, vía Cajicá-Zipaquirá<br>
            Lunes a viernes, de 8:00 a.m. a 5:00 p.m. <br>
            <a href="https://sites.google.com/unimilitar.edu.co/multimedia/ingenier%C3%ADa-en-multimedia">sites.google.com/unimilitar.edu.co/multimedia/ingeniería-en-multimedia</a>
        </p>
    </div>

    <div class="foot_social">
        <a href="https://www.instagram.com/ing.enmultimedia/">
            <svg class="icon_instagram" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
                <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"/>
            </svg>
        </a>

        <a href="https://sites.google.com/unimilitar.edu.co/multimedia/ingenier%C3%ADa-en-multimedia">
            <svg class="icon_www" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54.438 54.438" xml:space="preserve">
                <path d="M27.219,0C12.21,0,0,12.21,0,27.219s12.21,27.22,27.219,27.22s27.219-12.211,27.219-27.22
                S42.228,0,27.219,0z M47.851,37.852H37.697c0.468-2.775,0.749-5.705,0.837-8.633h11.813C50.082,32.308,49.21,35.224,47.851,37.852z
                M27.219,50.438c-1.76,0-3.982-3.14-5.52-8.587h11.04C31.201,47.299,28.979,50.438,27.219,50.438z M20.784,37.852
                c-0.465-2.558-0.78-5.448-0.875-8.633h14.619c-0.095,3.185-0.41,6.074-0.875,8.633H20.784z M4.092,29.219h11.812
                c0.088,2.928,0.369,5.858,0.837,8.633H6.588C5.229,35.224,4.357,32.308,4.092,29.219z M6.588,16.587h10.154
                c-0.468,2.775-0.749,5.704-0.837,8.632H4.092C4.357,22.13,5.229,19.214,6.588,16.587z M27.219,4c1.76,0,3.982,3.139,5.52,8.587
                H21.699C23.237,7.139,25.459,4,27.219,4z M33.654,16.587c0.465,2.558,0.78,5.447,0.875,8.632H19.909
                c0.095-3.185,0.41-6.074,0.875-8.632H33.654z M38.534,25.219c-0.088-2.928-0.369-5.857-0.837-8.632h10.154
                c1.359,2.627,2.231,5.543,2.496,8.632H38.534z M45.231,12.587h-8.369c-0.734-2.904-1.7-5.507-2.89-7.582
                C38.445,6.367,42.348,9.045,45.231,12.587z M20.466,5.005c-1.19,2.076-2.156,4.679-2.89,7.582H9.207
                C12.09,9.045,15.993,6.367,20.466,5.005z M9.208,41.852h8.368c0.734,2.904,1.7,5.506,2.89,7.582
                C15.993,48.071,12.09,45.393,9.208,41.852z M33.972,49.434c1.19-2.076,2.156-4.679,2.89-7.582h8.369
                C42.348,45.394,38.445,48.072,33.972,49.434z"/>
            </svg>
        </a>

        <a href="www.google.com">
            <svg class="icon_twt" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.711 14.929l-4.284 4.284h-4.285l-3.749 3.749v-3.749h-4.82v-16.067h17.138zM8.502 1.004l-5.356 5.356v19.279h6.427v5.356l5.356-5.356h4.284l9.641-9.64v-14.996zM21.356 6.895h2.142v6.427h-2.142zM15.464 6.895h2.143v6.427h-2.144z"></path>
            </svg>
        </a>

        <a href="https://www.youtube.com/@ing.enmultimedia">
            <svg class="icon_yt" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <style>
                        .cls-1{fill:none;}
                    </style>
                </defs>
                <title>logo--youtube</title>
                <path d="M29.41,9.26a3.5,3.5,0,0,0-2.47-2.47C24.76,6.2,16,6.2,16,6.2s-8.76,0-10.94.59A3.5,3.5,0,0,0,2.59,9.26,36.13,36.13,0,0,0,2,16a36.13,36.13,0,0,0,.59,6.74,3.5,3.5,0,0,0,2.47,2.47C7.24,25.8,16,25.8,16,25.8s8.76,0,10.94-.59a3.5,3.5,0,0,0,2.47-2.47A36.13,36.13,0,0,0,30,16,36.13,36.13,0,0,0,29.41,9.26ZM13.2,20.2V11.8L20.47,16Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect>
            </svg>
        </a>

        <a href="https://www.facebook.com/IngMultimediaCampus">
            <svg class="icon_fb" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                <path d="m1416.013 791.915-30.91 225.617h-371.252v789.66H788.234v-789.66H449.808V791.915h338.426V585.137c0-286.871 176.207-472.329 449.09-472.329 116.87 0 189.744 6.205 231.822 11.845l-3.272 213.66-173.5.338c-4.737-.451-117.771-9.25-199.332 65.655-52.568 48.169-79.191 117.433-79.191 205.65v181.96h402.162Zm-247.276-304.018c44.446-41.401 113.71-36.889 118.787-36.663l289.467-.113 6.204-417.504-43.544-10.717C1511.675 16.02 1426.053 0 1237.324 0 901.268 0 675.425 235.206 675.425 585.137v93.97H337v451.234h338.425V1920h451.234v-789.66h356.7l61.932-451.233H1126.66v-69.152c0-54.937 14.214-96 42.078-122.058Z" fill-rule="evenodd"/>
            </svg>
        </a>
    </div>
    
    <img src="../images/Logo_UMNG.jpg" class="UMNG_Logo">
    `;
}


function setUpHamburger(){
    const hamMenu = document.querySelector('.ham_menu');

    const offScreenMenu = document.querySelector('.off_screen')

    if(hamMenu && offScreenMenu){
        hamMenu.addEventListener('click', () => {
            hamMenu.classList.toggle('active');
            offScreenMenu.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (!hamMenu.contains(e.target) && !offScreenMenu.contains(e.target)){
            hamMenu.classList.remove('active');
            offScreenMenu.classList.remove('active');
        }
    });
}

// Add to your existing headfoot.js file

function setUpUserMenu(){
    const userIcon = document.querySelector('.user');
    const loginDropdown = document.getElementById('login-dropdown');
    
    if(!userIcon || !loginDropdown) return;
    
    // Toggle dropdown on user icon click
    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        loginDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if(!userIcon.contains(e.target) && !loginDropdown.contains(e.target)){
            loginDropdown.classList.remove('active');
        }
    });
    
    // Close dropdown when clicking on buttons (optional)
    const buttons = loginDropdown.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginDropdown.classList.remove('active');
            // Add your login/register logic here
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    setUpHamburger();
    setUpUserMenu();
});
