import { useEffect, useState } from "react";

import { Table } from "../../Components/Table";

import IconClose from "../../../Icons/IconClose";
import "./EventosEquipos.css";

const API = "http://localhost:8000";

function EventosEquipos(){
  const [events, setEvents] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null);
  const [teams, setTeams] = useState([]);

  const titulos_eventos = [
    { txt: "ID", key: "evento_id", size: "30px" },
    { txt: "Nombre", key: "name", size: "auto" },
    { txt: "Acciones", key: "actions", size: "150px" }
  ];

  const titulos_equipos = [
    { txt: "ID", key: "equipo_id", size: "30px" },
    { txt: "Nombre", key: "publicName", size: "auto" },
    { txt: "Acciones", key: "actions", size: "auto" }
  ];

  const actions_eventos = [
    {callback: (item)=> handleEventoShow(item), txt:"Ver", color:"#86afd1"},
    {callback: (item)=> console.log(item), txt:"Editar", color:"#c5da74"},
    {callback: (item)=> console.log(item), txt:"Borrar", color:"#ec8b8b"},
  ];

  const actions_equipos = [
    {callback: (item)=> console.log(item), txt:"Restore Password", color:"#86afd1"},
    {callback: (item)=> console.log(item), txt:"Borrar", color:"#ff8a8a"},
  ]

  const handleEventoShow = evento => {
    setSelectEvent(evento);
  }

  // Fetch Lista de eventos
  useEffect(()=>{
    fetch(API + "/event/get", {
      credentials: "include" 
    }).then(res => res.json())
    .then(data => {
      setEvents(data.data);
    })
  },[]);

  //Fetch Lista de equipos
  useEffect(()=>{
    if (!selectEvent) return;
    fetch(`${API}/equipo/filter/${selectEvent?.evento_id}`, {
      credentials: "include" 
    }).then(res => res.json())
    .then(data => {
      setTeams(data.data);
    })
  },[selectEvent]);

  return (
    <main>
      <h1>Equipos y Eventos</h1>
      
      <div className="Container">
        <section>
          <h2>Lista de eventos</h2>

          <Table 
            titulos={titulos_eventos}
            data={events ?? []}
            actions={actions_eventos}
          />

          <button
            className="btn-add"
          >Crear Evento</button>
        </section>

        <section 
          className={!selectEvent ? "hideTeams" : "Teams"}
        >
          <div className="teams-header">
            <h2>Equipos de <strong>{selectEvent?.name ?? ""}</strong></h2>
            <button 
              className="close-teams"
              onClick={()=> setSelectEvent(null)}
            >
              <IconClose color="#000"/>
            </button>
          </div>

          {(teams && teams.length !== 0) ? (
            <Table 
              titulos={titulos_equipos}
              data={teams ?? []}
              actions={actions_equipos}
            />
          ) : (
            <p 
              style={{
                "margin":"10px",
                "textAlign":"center",
                "fontStyle":"italic",
                "color":"#535353bb",
              }}
            >No hay Equipos aún...</p>
          )}

          <button
            className="btn-add"
          >Crear equipo</button>
        </section>
      </div>
    </main>
  );
}

export { EventosEquipos };