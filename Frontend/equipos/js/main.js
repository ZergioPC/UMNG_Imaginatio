// Variable global para almacenar los datos del equipo
let TEAM_DATA = null;
// La URL base de tu API. Asegúrate de que sea la correcta.
const API_URL = 'http://127.0.0.1:8000';

/**
 * Función principal que se ejecuta cuando el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Verifica la autenticación y obtiene los datos del equipo.
        await checkAuthAndLoadTeamData();
        if (!TEAM_DATA) {
            throw new Error("No se pudieron cargar los datos del equipo. Asegúrate de estar logueado.");
        }

        // 2. Carga los datos iniciales en la página.
        populateTeamForm();
        loadStudents();
        loadPosts();

        // 3. Configura los event listeners para los formularios y botones.
        setupEventListeners();

    } catch (error) {
        alert(error.message);
        // Si falla la autenticación o carga de datos, redirige al login.
        window.location.href = './login.html';
    }
});

/**
 * Verifica la sesión del usuario llamando a un endpoint protegido
 * y carga los datos del equipo en la variable global TEAM_DATA.
 */
async function checkAuthAndLoadTeamData() {
    try {
        const response = await apiFetch('/equipo/healty');
        TEAM_DATA = response.data[0];
    } catch (error) {
        // Si la petición falla, asumimos que el usuario no está logueado.
        console.error("Error de autenticación:", error);
        throw new Error("Sesión no válida o expirada.");
    }
}

/**
 * Rellena el formulario de edición del equipo con los datos cargados.
 */
function populateTeamForm() {
    document.getElementById('team-name').value = TEAM_DATA.equipo_name;
    document.getElementById('team-desc').value = TEAM_DATA.equipo_desc;
}

/**
 * Carga y renderiza la lista de estudiantes del equipo.
 */
async function loadStudents() {
    try {
        const response = await apiFetch(`/equipo/estudiante/filter/${TEAM_DATA.equipo_id}`);
        renderStudents(response.data);
    } catch (error) {
        alert(`Error al cargar integrantes: ${error.message}`);
    }
}

/**
 * Renderiza la lista de estudiantes en su tabla correspondiente.
 * @param {Array} students - La lista de estudiantes a renderizar.
 */
function renderStudents(students) {
    const tableBody = document.getElementById('integrantes-table');
    tableBody.innerHTML = ''; // Limpia la tabla antes de renderizar.

    if (!students || students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No hay integrantes registrados en este equipo.</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.codigo}</td>
            <td>${student.email}</td>
            <td class="actions">
                <button class="edit-student-btn" data-id="${student.est_id}">Editar</button>
                <button class="delete-student-btn" data-id="${student.est_id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Carga y renderiza la lista de publicaciones del equipo.
 */
async function loadPosts() {
    try {
        const response = await apiFetch(`/equipo/publicaciones/${TEAM_DATA.equipo_id}`);
        renderPosts(response.data);
    } catch (error) {
        alert(`Error al cargar las publicaciones: ${error.message}`);
    }
}

/**
 * Renderiza las publicaciones en su tabla.
 * @param {Array} posts - La lista de posts a renderizar.
 */
function renderPosts(posts) {
    const tableBody = document.getElementById('equipo-posts-table');
    tableBody.innerHTML = ''; // Limpia la tabla.

    if (!posts || posts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No hay publicaciones.</td></tr>';
        return;
    }

    posts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${post.post_id}</td>
            <td>${post.title}</td>
            <td>${post.likes}</td>
            <td class="actions">
                <button class="delete-post-btn" data-id="${post.post_id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Configura todos los event listeners de la página.
 */
function setupEventListeners() {
    document.getElementById('edit-team-form').addEventListener('submit', handleUpdateTeam);
    document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);
    document.getElementById('edit-student-form').addEventListener('submit', handleUpdateStudent);
    document.getElementById('add-post-form').addEventListener('submit', handleAddPost);

    // Listeners para botones dentro de las tablas (delegación de eventos).
    document.getElementById('integrantes-table').addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-student-btn')) {
            const studentId = event.target.dataset.id;
            const response = await apiFetch(`/equipo/estudiante/filter/${TEAM_DATA.equipo_id}`);
            const student = response.data.find(s => s.est_id == studentId);
            openEditStudentModal(student);
        }
        if (event.target.classList.contains('delete-student-btn')) {
            handleDeleteStudent(event.target.dataset.id);
        }
    });

    document.getElementById('equipo-posts-table').addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-post-btn')) {
            handleDeletePost(event.target.dataset.id);
        }
    });

    // Listener para el botón de cerrar el modal.
    document.getElementById('equipo-modal-btn-close').addEventListener('click', () => {
        document.getElementById('equipo-modal-edit').close();
    });
}


// --- MANEJADORES DE EVENTOS (HANDLERS) ---

async function handleUpdateTeam(event) {
    event.preventDefault();
    const data = {
        equipo_name: document.getElementById('team-name').value,
        equipo_desc: document.getElementById('team-desc').value,
    };

    try {
        await apiFetch(`/equipo/editar/${TEAM_DATA.equipo_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        alert("Equipo actualizado con éxito.");
    } catch (error) {
        alert(`Error al actualizar el equipo: ${error.message}`);
    }
}

async function handleAddStudent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        await apiFetch('/equipo/estudiante/crear', {
            method: 'POST',
            body: formData,
        });
        alert("Integrante agregado con éxito.");
        form.reset();
        loadStudents(); // Recarga la lista de estudiantes.
    } catch (error) {
        alert(`Error al agregar integrante: ${error.message}`);
    }
}

async function handleDeleteStudent(studentId) {
    if (!confirm(`¿Estás seguro de que quieres eliminar al integrante con ID ${studentId}?`)) {
        return;
    }
    try {
        await apiFetch(`/equipo/estudiante/delete/${studentId}`, { method: 'DELETE' });
        alert("Integrante eliminado con éxito.");
        loadStudents(); // Recarga la lista.
    } catch (error) {
        alert(`Error al eliminar integrante: ${error.message}`);
    }
}

function openEditStudentModal(student) {
    if (!student) return;
    const modal = document.getElementById('equipo-modal-edit');
    // Rellena el formulario del modal con los datos del estudiante.
    modal.querySelector('#edit-est-id').value = student.est_id;
    modal.querySelector('#edit-est-name').value = student.name;
    modal.querySelector('#edit-est-codigo').value = student.codigo;
    modal.querySelector('#edit-est-email').value = student.email;
    modal.querySelector('#edit-est-phone').value = student.phone || '';
    modal.querySelector('#edit-est-desc').value = student.desc || '';
    modal.querySelector('#edit-est-ig').value = student.instagram || '';
    modal.querySelector('#edit-est-twiter').value = student.twiter || '';
    modal.querySelector('#edit-est-tiktok').value = student.tiktok || '';
    modal.querySelector('#edit-est-img-preview').src = `${API_URL}/${student.img}`;
    modal.showModal();
}

async function handleUpdateStudent(event) {
    event.preventDefault();
    const modalForm = event.target;
    const studentId = modalForm.querySelector('#edit-est-id').value;
    
    // El endpoint de edición espera un JSON, no FormData.
    const data = {
        name: modalForm.querySelector('#edit-est-name').value,
        codigo: modalForm.querySelector('#edit-est-codigo').value,
        email: modalForm.querySelector('#edit-est-email').value,
        phone: modalForm.querySelector('#edit-est-phone').value,
        desc: modalForm.querySelector('#edit-est-desc').value,
        instagram: modalForm.querySelector('#edit-est-ig').value,
        twiter: modalForm.querySelector('#edit-est-twiter').value,
        tiktok: modalForm.querySelector('#edit-est-tiktok').value,
        equipo_id: TEAM_DATA.equipo_id
    };

    // Filtra campos opcionales que estén vacíos para no enviar `null` o `""`.
    const payload = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null && v !== ''));

    try {
        await apiFetch(`/equipo/estudiante/editar/${studentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        alert("Integrante actualizado con éxito.");
        document.getElementById('equipo-modal-edit').close();
        loadStudents(); // Recarga la lista.
    } catch (error) {
        alert(`Error al actualizar integrante: ${error.message}`);
    }
}

async function handleAddPost(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        await apiFetch('/equipo/publicar', {
            method: 'POST',
            body: formData,
        });
        alert("Publicación creada con éxito.");
        form.reset();
        loadPosts(); // Recarga la lista de posts.
    } catch (error) {
        alert(`Error al crear la publicación: ${error.message}`);
    }
}

async function handleDeletePost(postId) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la publicación con ID ${postId}?`)) {
        return;
    }
    try {
        // Usando POST como indicaste para el borrado del post.
        await apiFetch(`/post/delete/${postId}`, { method: 'DELETE' });
        alert("Publicación eliminada con éxito.");
        loadPosts(); // Recarga la lista de posts.
    } catch (error) {
        alert(`Error al eliminar la publicación: ${error.message}`);
    }
}


/**
 * Wrapper para la función fetch que centraliza la configuración de la API,
 * el manejo de credenciales y la gestión de errores comunes.
 * @param {string} endpoint - El endpoint de la API a llamar (ej. '/users').
 * @param {object} options - Opciones para la petición fetch (method, body, etc.).
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
async function apiFetch(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // "include" es correcto para autenticación basada en cookies.
        credentials: 'include', 
    };

    // Combina las opciones por defecto con las proporcionadas.
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    // Si el body es FormData, el navegador establece el Content-Type automáticamente.
    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error desconocido en la respuesta del servidor.' }));
        throw new Error(errorData.detail || `Error ${response.status}`);
    }

    // Algunos endpoints como DELETE pueden no devolver un cuerpo.
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
