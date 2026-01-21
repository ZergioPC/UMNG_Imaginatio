import API from "../../js/config.js";

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    setupCreateEventForm();
    setupEditModal();
    setupTeamForms();
    setupPostsPanel();
    setUpEditPlaceholder();
});

let currentPostPage = 0;

function setUpEditPlaceholder(){
    const formData = new FormData();
    const imgCurrent = document.getElementById('edit-placeholder-current');
    const imgInput = document.getElementById('edit-placeholder-img');
    const btnForm = document.getElementById('edit-placeholder-btn');

    imgCurrent.src = `${API}/uploads/users/idle.jpg`;

    btnForm.addEventListener("click",()=>{
        try {
            if (imgInput.files.length === 0) {
                throw new Error("No hay Imagen")
            }

            formData.append('img', imgInput.files[0]);

            fetch(`${API}/utils/placeholder-img`, {
                method: 'POST',
                body: formData,
                credentials: "include"
            });
            
            alert("Placeholder cambiado correctamente.");
            window.location.reload()
        } catch (error) {
            alert(`Error al actualizar Placeholder: ${error.message}`);
        }
    });

}

// MARK: Posts

function setupPostsPanel() {
    const loadButton = document.getElementById('load-posts-btn');
    const prevButton = document.getElementById('prev-post-page-btn');
    const nextButton = document.getElementById('next-post-page-btn');

    loadButton.addEventListener('click', () => {
        currentPostPage = 0;
        loadPosts(currentPostPage);
    });

    prevButton.addEventListener('click', () => {
        if (currentPostPage > 0) {
            currentPostPage--;
            loadPosts(currentPostPage);
        }
    });

    nextButton.addEventListener('click', () => {
        currentPostPage++;
        loadPosts(currentPostPage);
    });
}

function loadPosts(page) {
    const pageNumSpan = document.getElementById('post-page-num');
    const prevButton = document.getElementById('prev-post-page-btn');
    const nextButton = document.getElementById('next-post-page-btn');

    fetch(`${API}/post/pages/${page}`, { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('posts-table-body');
            tableBody.innerHTML = '';
            
            if (!data.data || data.data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No hay más posts para mostrar.</td></tr>';
                nextButton.disabled = true;
            } else {
                data.data.forEach(post => {
                    const row = `
                        <tr>
                            <td>${post.post_id}</td>
                            <td>${post.title}</td>
                            <td>${post.likes}</td>
                            <td>${post.equipo_id}</td>
                            <td class="actions">
                                <button class="delete-post-btn" data-id="${post.post_id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
                addEventListenersToPostButtons();
                nextButton.disabled = false;
            }

            pageNumSpan.textContent = page;
            prevButton.disabled = page === 0;
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            const tableBody = document.getElementById('posts-table-body');
            tableBody.innerHTML = '<tr><td colspan="5">Error al cargar los posts.</td></tr>';
        });
}

function addEventListenersToPostButtons() {
    document.querySelectorAll('.delete-post-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = e.target.dataset.id;            
            if (confirm(`¿Seguro que quieres eliminar el post con ID ${postId}?`)) {
                deletePost(postId);
            }
        });
    });
}

function deletePost(postId) {
    fetch(`${API}/post/delete-by-admin/${postId}`, {
        method: 'DELETE',
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            // Intenta leer el cuerpo del error para más detalles
            return response.json().then(err => {
                throw new Error(err.detail || `Error ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || 'Post eliminado con éxito.');
        loadPosts(currentPostPage); // Recargar los posts
    })
    .catch(error => {
        console.error('Error deleting post:', error);
        alert(`Error al eliminar el post: ${error.message}`);
    });
}

// MARK: Eventos y Equipos

function loadEvents() {
    fetch(API + "/event/get", { credentials: "include" })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('events-table-body');
            const createTeamEventSelect = document.getElementById('create-team-event-id');
            const filterTeamsEventSelect = document.getElementById('filter-teams-event-id');
            
            tableBody.innerHTML = '';
            createTeamEventSelect.innerHTML = '<option value="">Seleccionar Evento</option>';
            filterTeamsEventSelect.innerHTML = '<option value="">Seleccionar Evento para ver equipos</option>';

            data.data.forEach(event => {
                const row = `
                    <tr>
                        <td>${event.evento_id}</td>
                        <td>${event.name}</td>
                        <td>${event.desc}</td>
                        <td class="actions">
                            <button class="edit-btn" data-id="${event.evento_id}" data-name="${event.name}" data-desc="${event.desc}">Editar</button>
                            <button class="delete-btn" data-id="${event.evento_id}">Eliminar</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;

                const option = `<option value="${event.evento_id}">${event.name}</option>`;
                createTeamEventSelect.innerHTML += option;
                filterTeamsEventSelect.innerHTML += option;
            });
            addEventListenersToButtons();
        })
        .catch(error => console.error('Error loading events:', error));
}

function setupTeamForms() {
    setupCreateTeamForm();
    setupFilterTeamsForm();
}

function setupCreateTeamForm() {
    const createForm = document.getElementById('create-team-form');
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('create-team-name').value;
        const publicName = document.getElementById('create-team-publicName').value;
        const desc = document.getElementById('create-team-desc').value;
        const password = document.getElementById('create-team-password').value;
        const eventId = document.getElementById('create-team-event-id').value;

        if (!/^[a-zA-Z0-9]*$/.test(name)) {
            alert("Solo numeros y letras son validos en el ID.");
            return;
        }

        fetch(API + "/equipo/crear", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: name,
                publicName: publicName,
                desc: desc, 
                equipo_password: password, 
                evento_id: parseInt(eventId) 
            }),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            createForm.reset();
            if (eventId) {
                loadTeams(eventId);
            }
        })
        .catch(error => console.error('Error creating team:', error));
    });
}

function setupFilterTeamsForm() {
    const filterSelect = document.getElementById('filter-teams-event-id');
    filterSelect.addEventListener('change', (e) => {
        const eventId = e.target.value;
        if (eventId) {
            loadTeams(eventId);
        } else {
            document.getElementById('teams-table-body').innerHTML = '';
        }
    });
}

function loadTeams(eventId) {
    fetch(`${API}/equipo/filter/${eventId}`)
        .then(response => response.json())
        .then(data => {           
            if(data.detail){
                throw new Error(data.detail)
            }
            const tableBody = document.getElementById('teams-table-body');
            tableBody.innerHTML = '';
            data.data.forEach(team => {
                const row = `
                    <tr>
                        <td>${team.equipo_id}</td>
                        <td>${team.name}</td>
                        <td>${team.desc}</td>
                        <td class="actions">
                            <button class="delete-team-btn" data-id="${team.equipo_id}" data-event-id="${eventId}">Eliminar</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            addEventListenersToTeamButtons();
        })
        .catch(error => {
            console.error(error);
            alert('Error loading teams: No hay equipos en este evento');
        });
}

function addEventListenersToTeamButtons() {
    document.querySelectorAll('.delete-team-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const teamId = e.target.dataset.id;
            const eventId = e.target.dataset.eventId;
            if (confirm(`¿Seguro que quieres eliminar el equipo con ID ${teamId}?`)) {
                deleteTeam(teamId, eventId);
            }
        });
    });
}

function deleteTeam(teamId, eventId) {
    fetch(`${API}/equipo/delete/${teamId}`, {
        method: 'DELETE',
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (eventId) {
            loadTeams(eventId);
        }
    })
    .catch(error => console.error('Error deleting team:', error));
}

// MARK: Forms

function setupCreateEventForm() {
    const createForm = document.getElementById('create-event-form');
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('create-name').value;
        const desc = document.getElementById('create-desc').value;

        fetch(API + "/event/crear", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, desc }),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadEvents();
            createForm.reset();
        })
        .catch(error => console.error('Error creating event:', error));
    });
}

function addEventListenersToButtons() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const desc = e.target.dataset.desc;
            openEditModal(id, name, desc);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (confirm(`¿Seguro que quieres eliminar el evento con ID ${id}?`)) {
                deleteEvent(id);
            }
        });
    });
}

function deleteEvent(id) {
    fetch(`${API}/event/delete/${id}`, {
        method: 'DELETE',
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadEvents();
    })
    .catch(error => console.error('Error deleting event:', error));
}

// MARK: Modal

function openEditModal(id, name, desc) {
    const modal = document.getElementById('edit-modal');
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-desc').value = desc;
    modal.style.display = 'block';
}

function setupEditModal() {
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close-btn');
    const editForm = document.getElementById('edit-event-form');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const name = document.getElementById('edit-name').value;
        const desc = document.getElementById('edit-desc').value;

        fetch(`${API}/event/editar/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, desc }),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            modal.style.display = 'none';
            loadEvents();
        })
        .catch(error => console.error('Error editing event:', error));
    });
}
