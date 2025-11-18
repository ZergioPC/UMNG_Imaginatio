const user = document.getElementById('user');
const pass = document.getElementById('password');
const send = document.getElementById('send');

const API_ADDRESS = "http://127.0.0.1:8000";

send.addEventListener('click', () => {
    const data = {
        name: user.value,
        password: pass.value
    };

    fetch(API_ADDRESS + "/auth/admin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials:"include"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        if (data.success) {
            window.location.href = data.success;
        } else {
            alert('Login failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login');
    });
});
