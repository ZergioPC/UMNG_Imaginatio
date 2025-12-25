import API from "../../js/config.js"

fetch(API + "/auth/verify-admin", {
    method: 'GET',
    credentials:"include"
})
.then(response => response.json())
.then(data => {    
    if(data.detail){
        window.location.href = data.detail.url;
    }

    if(data.message){}
        alert(data.message);
})
.catch(error => {
    console.error('Error:', error);
});


