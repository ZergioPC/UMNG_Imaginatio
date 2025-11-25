const API = "http://192.168.0.21:8000";

function showEventInfo(evento,teams){

    const events_container = document.getElementById("event-array-list");
    const events_panel = document.getElementById("event-show-info");
    events_panel.innerHTML = "";

    events_container.classList.add("active");
    events_panel.classList.add("active");

    const h2 = document.createElement("h2");
    h2.innerText = evento.name;
    h2.classList.add("title");

    const p = document.createElement("p");
    p.innerText = evento.desc;
    p.classList.add("text");

    const ul = document.createElement("ul");
    ul.classList.add("equipos-list");

    if(teams){
        teams.forEach(team => {
            const img = document.createElement("img");
            img.src = team.img || "";
    
            const h4 = document.createElement("h4");
            h4.innerText = team.name;
    
            const div = document.createElement("div");
            div.appendChild(h4);
    
            const a = document.createElement("a");
            a.href = `/equipos/index.html?team=${team.equipo_id}`;
            a.appendChild(img);
            a.appendChild(div);
            
            const li = document.createElement("li");
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    const error = document.createElement("p");
    error.classList.add("advice");
    error.innerText = "¡Se el primero en Participar!";

    events_panel.appendChild(h2);
    events_panel.appendChild(p);
    events_panel.appendChild(ul);
    if (!teams) events_panel.appendChild(error);
}

function appendEventList(eventos){
    const events_container = document.getElementById("event-array-list");
    eventos.forEach(evento =>{        
        const id_name = `event-btn-${evento.evento_id}`

        const h3 = document.createElement("h3");   
        h3.innerText = evento.name;    

        const img = document.createElement("img");
        img.src = "";

        const btn = document.createElement("button");
        btn.innerText = "";
        btn.id = id_name;
        btn.addEventListener("click", ()=>{
            fetchTeamData(evento)
        });

        const label = document.createElement("label");
        label.for = id_name;
        label.classList.add("item");

        label.appendChild(img);
        label.appendChild(h3);
        label.appendChild(btn);

        events_container.appendChild(label);
    })
}

function fetchTeamData(evento){    
    fetch(API + `/equipo/filter/${evento.evento_id}`)
    .then(res => {
        if(!res.ok){
            throw new Error("No es posible cargar los Equipos");
        }
        return res.json()
    })
    .then(data => {      
        showEventInfo(evento, data.data);
    })
    .catch(error => {
        console.error('Error:', error);
        showEventInfo(evento);
    });
}

function fetchEvents(){
    fetch(API + "/event/get")
    .then(res => {
        if(!res.ok){
            throw new Error("No es posible cargar los Eventos");
        }
        return res.json()
    })
    .then(data => {            
        appendEventList(data.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded", ()=>{
    fetchEvents();
});