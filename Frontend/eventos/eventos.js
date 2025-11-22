document.addEventListener('DOMContentLoaded', function() {
    const eventos = document.querySelectorAll('.evento');
    const arrayEventos = document.getElementById('array_eventos');

    // Event data - customize with your actual event information
    const eventData = {
        0: {
            title: 'Evento Ejemplo Producto 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Grupo Gatillo Crew', 'Grupo J4s', 'Grupo BluStudios', 'Grupo HelMet', 'Grupo Cokcola']
        },
        1: {
            title: 'Evento Ejemplo Producto 2',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Equipo A', 'Equipo B', 'Equipo C']
        },
        2: {
            title: 'Evento Ejemplo Producto 3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Team X', 'Team Y', 'Team Z']
        },
        3: {
            title: 'Evento Ejemplo Producto 4',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Grupo Alpha', 'Grupo Beta', 'Grupo Gamma']
        },
        4: {
            title: 'Evento Ejemplo Producto 5',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Team 1', 'Team 2', 'Team 3']
        },
        5: {
            title: 'Evento Ejemplo Producto 6',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Squad A', 'Squad B', 'Squad C']
        },
        6: {
            title: 'Evento Ejemplo Producto 7',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Crew 1', 'Crew 2', 'Crew 3']
        },
        7: {
            title: 'Evento Ejemplo Producto 8',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt esse collum dolore eu fugiat nulla pariatur.',
            image: '../images/People/7.png',
            teams: ['Team Prime', 'Team Delta', 'Team Echo']
        }
    };

    // Add click listener to each event
    eventos.forEach((evento, index) => {
        evento.style.cursor = 'pointer';
        evento.addEventListener('click', function() {
            // Get data from HTML attributes if available, otherwise use eventData object
            const data = {
                title: evento.dataset.title || eventData[index]?.title,
                description: evento.dataset.description || eventData[index]?.description,
                image: evento.dataset.image || eventData[index]?.image,
                teams: evento.dataset.teams ? evento.dataset.teams.split(',').map(t => t.trim()) : eventData[index]?.teams || []
            };
            showEventDetail(index, data);
        });
    });

    function showEventDetail(index, data) {
        const detailHTML = `
            <div id="event-detail">
                <button id="back-btn" class="back-btn">← Volver</button>
                
                <div class="detail-content">
                    <div class="event-sidebar">
                        ${generateEventList(Object.keys(eventData).length)}
                    </div>
                    
                    <div class="event-main">
                        <div class="event-header">
                            <img src="${data.image}" alt="${data.title}">
                            <div class="event-header-text">
                                <h2>${data.title}</h2>
                                <p>${data.description}</p>
                            </div>
                        </div>
                        
                        <div class="event-teams">
                            <h3>Equipos Participando</h3>
                            <div class="teams-list">
                                ${data.teams.map(team => `<div class="team-badge">${team}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        arrayEventos.innerHTML = detailHTML;
        arrayEventos.id = 'array_eventos_detail';

        document.getElementById('back-btn').addEventListener('click', function() {
            location.reload();
        });

        // Add click listeners to sidebar events
        const sidebarEvents = document.querySelectorAll('.sidebar-event');
        sidebarEvents.forEach((item, idx) => {
            item.addEventListener('click', function() {
                showEventDetail(idx, eventData[idx]);
            });
        });
    }

    function generateEventList(count) {
        let html = '';
        for(let i = 0; i < count; i++) {
            html += `<div class="sidebar-event">Evento Ejemplo Producto</div>`;
        }
        return html;
    }
});