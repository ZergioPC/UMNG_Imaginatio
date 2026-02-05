import { useEffect, useState } from "react";

import { Table } from "../../Components/Table";
import { Modal } from "../../Components/Modal";

import IconClose from "../../../Icons/IconClose";

import "./EventosEquipos.css";

const API = "/api";

const formAddEventInit = {
  name: "",
  desc: "",
}

const formAddTeamInit = {
  name: "",
  publicName: "",
  desc:"",
  equipo_password: "",
  evento_id: 0,
}

function EventosEquipos(){
  const [events, setEvents] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  
  const [teams, setTeams] = useState([]);
  const [selectTeam, setSelectTeam] = useState(null);

  const [load, setLoad] = useState(true);
  const [openModalEventAdd, setOpenModalEventAdd] = useState(false);
  const [openModalEventEdit, setOpenModalEventEdit] = useState(false);
  const [openModalEventDelete, setOpenModalEventDelete] = useState(false);
  
  const [openModalTeamAdd, setOpenModalTeamAdd] = useState(false);
  const [openModalTeamDelete, setOpenModalTeamDelete] = useState(false);

  const [formAddEvent, setFormAddEvent] = useState(formAddEventInit);
  const [formAddTeam, setFormAddTeam] = useState(formAddTeamInit);

  const titulos_eventos = [
    { txt: "ID", key: "evento_id", size: "30px" },
    { txt: "Nombre", key: "name", size: "auto" },
    { txt: "Acciones", key: "actions", size: "150px" }
  ];

  const titulos_equipos = [
    { txt: "ID", key: "equipo_id", size: "30px" },
    { txt: "Nombre", key: "name", size: "auto" },
    { txt: "Acciones", key: "actions", size: "auto" }
  ];

  const actions_eventos = [
    {callback: (item)=> handleEventoVer(item), txt:"Ver", color:"#86afd1"},
    {callback: (item)=> handleEventoEditar(item), txt:"Editar", color:"#c5da74"},
    {callback: (item)=> handleEventoBorrar(item), txt:"Borrar", color:"#ec8b8b"},
  ];

  const actions_equipos = [
    {callback: (item)=> console.log(item), txt:"Restore Password", color:"#86afd1"},
    {callback: (item)=> handleTeamBorrar(item), txt:"Borrar", color:"#ff8a8a"},
  ]
  
  // MARK: Forms Eventos
  const handleEventoOnCreate = e => {
    e.preventDefault();
      
    if(!confirm(`Crear evento ${formAddEvent.name}?`)){
      return;
    }

    fetch(API + "/event/crear", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formAddEvent),
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalEventAdd(false);
      setLoad(true);
      setFormAddEvent(formAddEventInit);
    });
  }

  const handleEventoOnEdit = e => {
    e.preventDefault();
      
    if (!editEvent) return;
    if(!confirm(`Editar evento ${editEvent.name}?`)){
      return;
    }

    fetch(`${API}/event/editar/${editEvent.evento_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editEvent),
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalEventEdit(false);
      setLoad(true);
      setEditEvent(null);
    });
  }

  const handleEventoOnDelete = e => {
    e.preventDefault();
      
    if (!selectEvent) return;
    if(!confirm(`Borrar evento ${selectEvent.name}?`)){
      return;
    }

    fetch(`${API}/event/delete/${selectEvent.evento_id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalEventDelete(false);
      setLoad(true);
      setSelectEvent(null);
    });
  }

  const handleEventoVer = evento => {
    setSelectEvent(evento);
  }

  const handleEventoEditar = evento => {
    setEditEvent(evento);
    setOpenModalEventEdit(true);
  }

  const handleEventoBorrar = evento => {
    setSelectEvent(evento);
    setOpenModalEventDelete(true);
  }

  // MARK: Forms Equipos
  const handleTeamOnCreate = e => {
    e.preventDefault();
      
    if(!confirm(`Crear Equipo ${formAddTeam.publicName}?`)){
      return;
    }

    fetch(API + "/equipo/crear", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formAddTeam),
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalTeamAdd(false);
      setLoad(true);
      setFormAddTeam(formAddTeamInit);
    });
  }

  const handleTeamOnDelete = e => {
    e.preventDefault();
      
    if (!selectTeam) return;
    if(!confirm(`Borrar equipo ${selectTeam.publicName}?`)){
      return;
    }

    fetch(`${API}/equipo/delete/${selectTeam.equipo_id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalTeamDelete(false);
      setLoad(true);
      setSelectTeam(null);
    });
  }

  const handleTeamBorrar = team => {
    setSelectTeam(team);
    setOpenModalTeamDelete(true);
  }

  // Fetch Lista de eventos
  useEffect(()=>{
    if (!load) return;

    fetch(API + "/event/get", {
      credentials: "include" 
    }).then(res => res.json())
    .then(data => {
      setEvents(data.data);
      setLoad(false);
    })
  },[load]);

  //Fetch Lista de equipos
  useEffect(()=>{
    if (!selectEvent) return;

    fetch(`${API}/equipo/filter-admin/${selectEvent?.evento_id}`, {
      credentials: "include" 
    }).then(res => res.json())
    .then(data => {
      setTeams(data.data);
    }).finally(setFormAddTeam({
      ...formAddTeam,
      evento_id: selectEvent.evento_id,
    }))
  },[selectEvent, load]);

  // MARK: Return
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
            onClick={()=> setOpenModalEventAdd(true)}
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
            onClick={()=> setOpenModalTeamAdd(true)}
          >Crear equipo</button>
        </section>
      </div>

      {openModalEventAdd && (<Modal>
        <form 
          className="Form"
          onSubmit={handleEventoOnCreate}
        >
          <h2>Crear Evento</h2>

          <input 
            required 
            type="text" 
            placeholder="Nombre del evento"
            value={formAddEvent.name}
            onChange={e => 
              setFormAddEvent({
                ...formAddEvent,
                name: e.target.value
              })
            } 
          />

          <textarea 
            name=""
            value={formAddEvent.desc}
            placeholder="Descripción del evento..."
            onChange={e => 
              setFormAddEvent({
                ...formAddEvent,
                desc: e.target.value
              })
            } 
          />
          
          <div className="btn-container">
            <button
              type="submit"
            >Crear</button>

            <button
              onClick={()=> setOpenModalEventAdd(false)}
            >Cancelar</button>
          </div>
        </form>
      </Modal>)}

      {openModalEventEdit && (<Modal>
        <form 
          className="Form"
          onSubmit={handleEventoOnEdit}
        >
          <h2>Editar Evento</h2>

          <input 
            required 
            type="text" 
            placeholder="Nombre del evento"
            value={editEvent?.name || ""}
            onChange={e => 
              setEditEvent({
                ...editEvent,
                name: e.target.value
              })
            } 
          />

          <textarea 
            name=""
            value={editEvent?.desc || ""}
            placeholder="Descripción del evento..."
            onChange={e => 
              setEditEvent({
                ...editEvent,
                desc: e.target.value
              })
            } 
          />
          
          <div className="btn-container">
            <button
              type="submit"
            >Editar</button>

            <button
              onClick={()=> setOpenModalEventEdit(false)}
            >Cancelar</button>
          </div>
        </form>
      </Modal>)}

      {openModalEventDelete && (<Modal>
        <form 
          className="Form"
          onSubmit={handleEventoOnDelete}
        >
          <h2>Borrar Evento</h2>

          <p>¿Borrar el evento {selectEvent?.name ?? ""}?</p>
          
          <div className="btn-container">
            <button
            style={{"backgroundColor":"#ff7474"}}
              type="submit"
            >Borrar</button>

            <button
              onClick={()=> setOpenModalEventDelete(false)}
            >Cancelar</button>
          </div>
        </form>
      </Modal>)}

      {openModalTeamAdd && (<Modal>
        <form 
          className="Form"
          onSubmit={handleTeamOnCreate}
        >
          <label>
            <h4>Username</h4>
            <input 
              required
              type="text" 
              maxlength="10" 
              placeholder="dinamita77"
              value={formAddTeam.name}
              onChange={e => setFormAddTeam ({
                ...formAddTeam,
                name: e.target.value,
              })}
            />
          </label>

          <label>
            <h4>Nombre del Equipo</h4>
            <input 
              required
              type="text" 
              placeholder="Equipo Dinamita"
              value={formAddTeam.publicName}
              onChange={e => setFormAddTeam ({
                ...formAddTeam,
                publicName: e.target.value,
              })} 
            />
          </label>

          <label>
            <h4>Descripción</h4>
            <textarea 
              required 
              placeholder="Descripción del equipo..."
              value={formAddTeam.desc}
              onChange={e => setFormAddTeam ({
                ...formAddTeam,
                desc: e.target.value,
              })} 
            />
          </label>

          <label>
            <h4>Contraseña</h4>
            <input 
              required
              type="password" 
              placeholder="Contraseña del equipo"
              value={formAddTeam.equipo_password}
              onChange={e => setFormAddTeam ({
                ...formAddTeam,
                equipo_password: e.target.value,
              })} 
            />
          </label>
          
          <div className="btn-container">
            <button
              type="submit"
            >Crear</button>
            <button
              onClick={()=> setOpenModalTeamAdd(false)}
            >Cancelar</button>
          </div>
        </form>
      </Modal>)}
      
      {openModalTeamDelete && (<Modal>
        <form 
          className="Form"
          onSubmit={handleTeamOnDelete}
        >
          <h2>Borrar Equipo</h2>

          <p>¿Borrar el equipo {selectTeam?.publicName ?? ""}?</p>
          
          <div className="btn-container">
            <button
              style={{"backgroundColor":"#ff7474"}}
              type="submit"
            >Borrar</button>

            <button
              onClick={()=> setOpenModalTeamDelete(false)}
            >Cancelar</button>
          </div>
        </form>
      </Modal>)}
    </main>
  );
}

export { EventosEquipos };