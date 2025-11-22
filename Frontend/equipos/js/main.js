// Edit Members Modal
const editUserModal = document.getElementById("equipo-modal-edit");
const editUserBtn = document.getElementById("equipo-modal-btn");
editUserBtn.addEventListener("click",()=>{
    editUserModal.close();
});

// Posts
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

function deletePost(id){
    alert(id);
}

function loadPosts() {
    // fetch(`${API_ADDRESS}/post/pages/${page}`, { credentials: "include" })
    //     .then(response => response.json())
    //     .then(data => {
            
    //     })
    //     .catch(error => {
    //         console.error('Error loading posts:', error);
    //         const tableBody = document.getElementById('posts-table-body');
    //         tableBody.innerHTML = '<tr><td colspan="5">Error al cargar los posts.</td></tr>';
    //     });
    const tableBody = document.getElementById('equipo-posts-table');
    tableBody.innerHTML = '';

    const data = {
        data:[
            {
                post_id:0,
                title:"Titulo1",
                likes:3,
            }
        ]
    }

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
                    <td class="actions">
                        <button class="delete-post-btn" data-id="${post.post_id}">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
        addEventListenersToPostButtons();
    }
}

document.getElementById("equipo-posts-load").addEventListener("click", loadPosts);

function showModalEventListener(){
    const selectInput = document.getElementById("filter-users-team-id");
    selectInput.addEventListener("change", ()=>{
        console.log(selectInput.value);
        editUserModal.showModal();
    });
}

window.onload = ()=>{
    const selectInput = document.getElementById("filter-users-team-id");
    selectInput.innerHTML = "";
    if(data.data){
        data.data.forEach(user => {
            const option = `<option class="equipo-member-filter-input" value="${user.est_id}">${user.name}</option>`;
            selectInput.innerHTML += option;
        });
        showModalEventListener();
    }
}