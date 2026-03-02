import { useState, useEffect, use } from "react";

import { Table } from "../../Components/Table";
import { Modal } from "../../Components/Modal";

import "./Mundialito.css";

import GLOBALS from "@/config/globals.js";

const API = GLOBALS.API;

const formAddFaseInit = { name: "" };
const formAddTeamInit = { name: "" };
const formAddPartidoInit = { fase_id: 0, equipo_1: 0, equipo_2: 0, equipo_1_score: 0, equipo_2_score: 0 };
const formAddProfeInit = { name: "", img: null };
const formEditPartidoInit = { equipo_1_score: 0, equipo_2_score: 0, winner: null };

function Mundialito(){
  const [load, setLoad] = useState(true);

  const [fases, setFases] = useState([]);
  const [teams, setTeams] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  
  const [selectFase, setSelectFase] = useState(null);
  const [selectTeam, setSelectTeam] = useState(null);
  const [selectPartido, setSelectPartido] = useState(null);
  const [selectProfe, setSelectProfe] = useState(null);
  
  const [editPartido, setEditPartido] = useState(null);

  const [openModalFaseAdd, setOpenModalFaseAdd] = useState(false);
  const [openModalFaseDelete, setOpenModalFaseDelete] = useState(false);
  
  const [openModalTeamAdd, setOpenModalTeamAdd] = useState(false);
  const [openModalTeamDelete, setOpenModalTeamDelete] = useState(false);
  const [openModalTeamClean, setOpenModalTeamClean] = useState(false);
  const [openModalTeamFreeProfe, setOpenModalTeamFreeProfe] = useState(false);
  
  const [openModalPartidoAdd, setOpenModalPartidoAdd] = useState(false);
  const [openModalPartidoDelete, setOpenModalPartidoDelete] = useState(false);
  const [openModalPartidoEdit, setOpenModalPartidoEdit] = useState(false);

  const [openModalProfeAdd, setOpenModalProfeAdd] = useState(false);
  const [openModalProfeDelete, setOpenModalProfeDelete] = useState(false);

  const [formAddFase, setFormAddFase] = useState(formAddFaseInit);
  const [formAddTeam, setFormAddTeam] = useState(formAddTeamInit);
  const [formAddPartido, setFormAddPartido] = useState(formAddPartidoInit);
  const [formAddProfe, setFormAddProfe] = useState(formAddProfeInit);
  const [formEditPartido, setFormEditPartido] = useState(formEditPartidoInit);

  const titulos_fases = [
    { txt: "ID", key: "id", size: "50px" },
    { txt: "Nombre", key: "name", size: "auto" },
    { txt: "Acciones", key: "actions", size: "150px" }
  ];

  const titulos_equipos = [
    { txt: "ID", key: "id", size: "50px" },
    { txt: "Nombre", key: "name", size: "auto" },
    { txt: "Lleno", key: "fulled", size: "80px" },
    { txt: "Tiene Profe", key: "hasProfesor", size: "100px" },
    { txt: "Acciones", key: "actions", size: "150px" }
  ];

  const titulos_partidos = [
    { txt: "ID", key: "id", size: "40px" },
    { txt: "Equipo 1", key: "equipo_1", size: "80px" },
    { txt: "Score", key: "score", size: "80px" },
    { txt: "Equipo 2", key: "equipo_2", size: "80px" },
    { txt: "Fase ID", key: "fase_id", size: "60px" },
    { txt: "Acciones", key: "actions", size: "150px" }
  ];

  const titulos_profesores = [
    { txt: "ID", key: "id", size: "40px" },
    { txt: "Nombre", key: "name", size: "auto" },
    { txt: "Equipo ID", key: "equipo_id", size: "80px" },
    { txt: "Imagen", key: "img_url", size: "100px" },
    { txt: "Acciones", key: "actions", size: "150px" }
  ];

  const actions_fases = [
    {callback: (item)=> handleFaseBorrar(item), txt:"Borrar", color:"#ec8b8b"},
  ];

  const actions_equipos = [
    {callback: (item)=> handleTeamBorrar(item), txt:"Borrar", color:"#ec8b8b"},
    {callback: (item)=> handleTeamClean(item), txt:"Clean", color:"#ec8b8b"},
    {callback: (item)=> handleTeamFreeProfe(item), txt:"Free Profe", color:"#ec8b8b"},
  ];

  const actions_partidos = [
    {callback: (item)=> handlePartidoEdit(item), txt:"Editar", color:"#8399d6"},
    {callback: (item)=> handlePartidoBorrar(item), txt:"Borrar", color:"#ec8b8b"},
  ];

  const actions_profesores = [
    {callback: (item)=> handleProfeBorrar(item), txt:"Borrar", color:"#ec8b8b"},
  ];

  const getEquiposName = (id) => {
    const team = teams.find(t => t.id === id);
    return team ? team.name : `Equipo #${id}`;
  };

  const formatPartidosData = () => {
    return partidos.map(p => ({
      ...p,
      equipo_1: getEquiposName(p.equipo_1),
      equipo_2: getEquiposName(p.equipo_2),
      score: `${p.equipo_1_score} - ${p.equipo_2_score}`
    }));
  };

  const formatProfesoresData = () => {
    return profesores.map(p => ({
      ...p,
      img_url: p.img_url ? "📷" : "❌"
    }));
  };

  // MARK: Fases
  const handleFaseOnCreate = e => {
    e.preventDefault();
    if(!confirm(`Crear fase ${formAddFase.name}?`)) return;

    fetch(API + "/torneo_fase/create", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formAddFase),
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalFaseAdd(false);
      setLoad(true);
      setFormAddFase(formAddFaseInit);
    });
  };

  const handleFaseOnDelete = e => {
    e.preventDefault();
    if (!selectFase) return;
    if(!confirm(`Borrar fase ${selectFase.name}?`)) return;

    fetch(`${API}/torneo_fase/delete/${selectFase.id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalFaseDelete(false);
      setLoad(true);
      setSelectFase(null);
    });
  };

  const handleFaseBorrar = fase => {
    setSelectFase(fase);
    setOpenModalFaseDelete(true);
  };

  // MARK: Equipos
  const handleTeamOnCreate = e => {
    e.preventDefault();
    if(!confirm(`Crear equipo ${formAddTeam.name}?`)) return;

    fetch(API + "/torneo_team/create", {
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
    }).catch(err => {
      alert(err.detail || "Error al crear equipo");
    });
  };

  const handleTeamOnDelete = e => {
    e.preventDefault();
    if (!selectTeam) return;
    if(!confirm(`Borrar equipo ${selectTeam.name}?`)) return;

    fetch(`${API}/torneo_team/delete/${selectTeam.id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalTeamDelete(false);
      setLoad(true);
      setSelectTeam(null);
    });
  };

  const handleTeamOnClean = e => {
    e.preventDefault();
    if (!selectTeam) return;
    if(!confirm(`Restaurar equipo ${selectTeam.name}?`)) return;

    fetch(`${API}/torneo_team/free-players/${selectTeam.id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalTeamClean(false);
      setLoad(true);
      setSelectTeam(null);
    });
  };

    const handleTeamOnFreeProfe = e => {
    e.preventDefault();
    if (!selectTeam) return;
    if(!confirm(`Borrar Profesor ${selectTeam.name}?`)) return;

    fetch(`${API}/torneo_team/free-profe/${selectTeam.id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalTeamFreeProfe(false);
      setLoad(true);
      setSelectTeam(null);
    });
  };

  const handleTeamBorrar = team => {
    setSelectTeam(team);
    setOpenModalTeamDelete(true);
  };

  const handleTeamClean = team => {
    setSelectTeam(team);
    setOpenModalTeamClean(true);
  };

  const handleTeamFreeProfe = team => {
    setSelectTeam(team);
    setOpenModalTeamFreeProfe(true);
  };

  // MARK: Partidos
  const handlePartidoOnCreate = e => {
    e.preventDefault();
    if(!confirm(`Crear partido?`)) return;

    const partidoData = {
      fase_id: parseInt(formAddPartido.fase_id),
      equipo_1: parseInt(formAddPartido.equipo_1),
      equipo_2: parseInt(formAddPartido.equipo_2),
      equipo_1_score: parseInt(formAddPartido.equipo_1_score),
      equipo_2_score: parseInt(formAddPartido.equipo_2_score)
    };

    fetch(API + "/torneo_partido/create", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partidoData),
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalPartidoAdd(false);
      setLoad(true);
      setFormAddPartido(formAddPartidoInit);
    }).catch(err => {
      alert(err.detail || "Error al crear partido");
    });
  };

  const handlePartidoOnDelete = e => {
    e.preventDefault();
    if (!selectPartido) return;
    if(!confirm(`Borrar partido?`)) return;

    fetch(`${API}/torneo_partido/delete/${selectPartido.id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalPartidoDelete(false);
      setLoad(true);
      setSelectPartido(null);
    });
  };

  const handlePartidoOnEdit = e => {
    e.preventDefault();
    if (!editPartido) return;

    fetch(`${API}/torneo_partido/edit/${editPartido.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipo_1_score: parseInt(formEditPartido.equipo_1_score),
        equipo_2_score: parseInt(formEditPartido.equipo_2_score),
        winner: formEditPartido.winner || null
      }),
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalPartidoEdit(false);
      setLoad(true);
      setEditPartido(null);
      setFormEditPartido(formEditPartidoInit);
    }).catch(err => {
      alert(err.detail || "Error al editar partido");
    });
  };

  const handlePartidoEdit = partido => {
    const originalPartido = partidos.find(p => p.id === partido.id);
    setEditPartido(originalPartido);
    setFormEditPartido({
      equipo_1_score: originalPartido.equipo_1_score,
      equipo_2_score: originalPartido.equipo_2_score,
      winner: originalPartido.winner || null
    });
    setOpenModalPartidoEdit(true);
  };

  const handlePartidoBorrar = partido => {
    setSelectPartido(partido);
    setOpenModalPartidoDelete(true);
  };

  // MARK: Profesores
  const handleProfeOnCreate = e => {
    e.preventDefault();
    if(!confirm(`Crear profesor ${formAddProfe.name}?`)) return;

    const formData = new FormData();
    formData.append("name", formAddProfe.name);
    if (formAddProfe.img) {
      formData.append("img", formAddProfe.img);
    }

    fetch(API + "/torneo_profe/crear", {
      method: 'POST',
      body: formData,
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalProfeAdd(false);
      setLoad(true);
      setFormAddProfe(formAddProfeInit);
    }).catch(err => {
      alert(err.detail || "Error al crear profesor");
    });
  };

  const handleProfeOnDelete = e => {
    e.preventDefault();
    if (!selectProfe) return;
    if(!confirm(`Borrar profesor ${selectProfe.name}?`)) return;

    fetch(`${API}/torneo_profe/delete/${selectProfe.id}`, {
      method: 'DELETE',
      credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      setOpenModalProfeDelete(false);
      setLoad(true);
      setSelectProfe(null);
    });
  };

  const handleProfeBorrar = profe => {
    setSelectProfe(profe);
    setOpenModalProfeDelete(true);
  };

  const handleProfeImgChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormAddProfe({ ...formAddProfe, img: file });
    }
  };

  // MARK: Fetch Data
  useEffect(()=>{
    if (!load) return;

    Promise.all([
      fetch(API + "/torneo_fase/get", { credentials: "include" }).then(res => res.json()),
      fetch(API + "/torneo_team/get", { credentials: "include" }).then(res => res.json()),
      fetch(API + "/torneo_partido/get", { credentials: "include" }).then(res => res.json()),
      fetch(API + "/torneo_profe/get", { credentials: "include" }).then(res => res.json())
    ]).then(([fasesData, teamsData, partidosData, profesData]) => {
      setFases(fasesData.data || []);
      setTeams(teamsData.data || []);
      setPartidos(partidosData.data || []);
      setProfesores(profesData.data || []);
      setLoad(false);
    }).catch(err => {
      console.error("Error fetching data:", err);
      setLoad(false);
    });
  },[load]);

  return (
    <>
    <main className="Mundialito">
      <h1>Mundialito Setup</h1>

      <section>
        <h2>Fases</h2>
        <Table 
          titulos={titulos_fases}
          data={fases}
          actions={actions_fases}
        />
        <button 
          className="btn-add" onClick={()=> setOpenModalFaseAdd(true)}
        >Crear Fase</button>
      </section>

      <section>
        <h2>Equipos</h2>
        <Table 
          titulos={titulos_equipos}
          data={teams}
          actions={actions_equipos}
        />
        <button 
          className="btn-add" onClick={()=> setOpenModalTeamAdd(true)}
        >Crear Equipo</button>
      </section>

      <section>
        <h2>Partidos</h2>
        <Table 
          titulos={titulos_partidos}
          data={formatPartidosData()}
          actions={actions_partidos}
        />
        <button 
          className="btn-add" onClick={()=> setOpenModalPartidoAdd(true)}
        >Crear Partido</button>
      </section>

      <section>
        <h2>Profesores</h2>
        <Table 
          titulos={titulos_profesores}
          data={formatProfesoresData()}
          actions={actions_profesores}
        />
        <button 
          className="btn-add" onClick={()=> setOpenModalProfeAdd(true)}
        >Crear Profesor</button>
      </section>
    </main>

    {/* Modal Crear Fase */}
    {openModalFaseAdd && (<Modal>
      <form className="Form" onSubmit={handleFaseOnCreate}>
        <h2>Crear Fase</h2>
        <input 
          required 
          type="text" 
          placeholder="Nombre de la fase"
          value={formAddFase.name}
          onChange={e => setFormAddFase({ ...formAddFase, name: e.target.value })}
        />
        <div className="btn-container">
          <button type="submit">Crear</button>
          <button type="button" onClick={()=> setOpenModalFaseAdd(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Borrar Fase */}
    {openModalFaseDelete && (<Modal>
      <form className="Form" onSubmit={handleFaseOnDelete}>
        <h2>Borrar Fase</h2>
        <p>¿Borrar la fase {selectFase?.name}?</p>
        <div className="btn-container">
          <button type="submit" style={{backgroundColor:"#ff7474"}}>Borrar</button>
          <button type="button" onClick={()=> setOpenModalFaseDelete(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Crear Equipo */}
    {openModalTeamAdd && (<Modal>
      <form className="Form" onSubmit={handleTeamOnCreate}>
        <h2>Crear Equipo</h2>
        <input 
          required 
          type="text" 
          placeholder="Nombre del equipo"
          value={formAddTeam.name}
          onChange={e => setFormAddTeam({ ...formAddTeam, name: e.target.value })}
        />
        <div className="btn-container">
          <button type="submit">Crear</button>
          <button type="button" onClick={()=> setOpenModalTeamAdd(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Borrar Equipo */}
    {openModalTeamDelete && (<Modal>
      <form className="Form" onSubmit={handleTeamOnDelete}>
        <h2>Borrar Equipo</h2>
        <p>¿Borrar el equipo {selectTeam?.name}?</p>
        <div className="btn-container">
          <button type="submit" style={{backgroundColor:"#ff7474"}}>Borrar</button>
          <button type="button" onClick={()=> setOpenModalTeamDelete(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Limpiar Equipo */}
    {openModalTeamClean && (<Modal>
      <form className="Form" onSubmit={handleTeamOnClean}>
        <h2>Restaurar el equipo</h2>
        <p>¿Borrar a los jugadores el equipo {selectTeam?.name}?</p>
        <div className="btn-container">
          <button type="submit" style={{backgroundColor:"#ff7474"}}>Restaurar</button>
          <button type="button" onClick={()=> setOpenModalTeamClean(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Liberar profe Equipo */}
    {openModalTeamFreeProfe && (<Modal>
      <form className="Form" onSubmit={handleTeamOnFreeProfe}>
        <h2>Restaurar profe del equipo</h2>
        <p>¿Borrar easignado el profesor ctual de {selectTeam?.name}?</p>
        <div className="btn-container">
          <button type="submit" style={{backgroundColor:"#ff7474"}}>Limpiar</button>
          <button type="button" onClick={()=> setOpenModalTeamFreeProfe(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Crear Partido */}
    {openModalPartidoAdd && (<Modal>
      <form className="Form" onSubmit={handlePartidoOnCreate}>
        <h2>Crear Partido</h2>
        
        <label>
          <h4>Fase</h4>
          <select 
            required
            value={formAddPartido.fase_id}
            onChange={e => setFormAddPartido({ ...formAddPartido, fase_id: e.target.value })}
          >
            <option value="">Seleccionar fase</option>
            {fases.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </label>

        <label>
          <h4>Equipo 1</h4>
          <select 
            required
            value={formAddPartido.equipo_1}
            onChange={e => setFormAddPartido({ ...formAddPartido, equipo_1: e.target.value })}
          >
            <option value="">Seleccionar equipo</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <label>
          <h4>Equipo 2</h4>
          <select 
            required
            value={formAddPartido.equipo_2}
            onChange={e => setFormAddPartido({ ...formAddPartido, equipo_2: e.target.value })}
          >
            <option value="">Seleccionar equipo</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <label>
          <h4>Marcador Equipo 1</h4>
          <input 
            type="number"
            min="0"
            value={formAddPartido.equipo_1_score}
            onChange={e => setFormAddPartido({ ...formAddPartido, equipo_1_score: e.target.value })}
          />
        </label>

        <label>
          <h4>Marcador Equipo 2</h4>
          <input 
            type="number"
            min="0"
            value={formAddPartido.equipo_2_score}
            onChange={e => setFormAddPartido({ ...formAddPartido, equipo_2_score: e.target.value })}
          />
        </label>

        <div className="btn-container">
          <button type="submit">Crear</button>
          <button type="button" onClick={()=> setOpenModalPartidoAdd(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Editar Partido */}
    {openModalPartidoEdit && (<Modal>
      <form className="Form" onSubmit={handlePartidoOnEdit}>
        <h2>Editar Partido</h2>

        <h3>Marcador</h3>
        <div className="Form-Marcador">
          <div>
            <h4>{getEquiposName(editPartido?.equipo_1)}</h4>
            <input 
              type="number"
              min="0"
              value={formEditPartido.equipo_1_score}
              onChange={e => setFormEditPartido({ ...formEditPartido, equipo_1_score: e.target.value })}
            />
          </div>
          <div>
            <h4>{getEquiposName(editPartido?.equipo_2)}</h4>
            <input 
              type="number"
              min="0"
              value={formEditPartido.equipo_2_score}
              onChange={e => setFormEditPartido({ ...formEditPartido, equipo_2_score: e.target.value })}
            />
          </div>
        </div>

        <label>
          <h4>Ganador</h4>
          <select 
            value={formEditPartido.winner || ""}
            onChange={e => setFormEditPartido({ ...formEditPartido, winner: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">Sin winner</option>
            {teams
              .filter(t => t.id === editPartido?.equipo_1 || t.id === editPartido?.equipo_2)
              .map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))
            }
          </select>
        </label>

        <div className="btn-container">
          <button type="submit">Editar</button>
          <button type="button" onClick={()=> setOpenModalPartidoEdit(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Borrar Partido */}
    {openModalPartidoDelete && (<Modal>
      <form className="Form" onSubmit={handlePartidoOnDelete}>
        <h2>Borrar Partido</h2>
        <p>¿Borrar el partido?</p>
        <div className="btn-container">
          <button type="submit" style={{backgroundColor:"#ff7474"}}>Borrar</button>
          <button type="button" onClick={()=> setOpenModalPartidoDelete(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Crear Profesor */}
    {openModalProfeAdd && (<Modal>
      <form className="Form" onSubmit={handleProfeOnCreate}>
        <h2>Crear Profesor</h2>
        <input 
          required 
          type="text" 
          placeholder="Nombre del profesor"
          value={formAddProfe.name}
          onChange={e => setFormAddProfe({ ...formAddProfe, name: e.target.value })}
        />
        <label>
          <h4>Imagen</h4>
          <input 
            type="file"
            accept="image/*"
            onChange={handleProfeImgChange}
          />
        </label>
        <div className="btn-container">
          <button type="submit">Crear</button>
          <button type="button" onClick={()=> setOpenModalProfeAdd(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}

    {/* Modal Borrar Profesor */}
    {openModalProfeDelete && (<Modal>
      <form className="Form" onSubmit={handleProfeOnDelete}>
        <h2>Borrar Profesor</h2>
        <p>¿Borrar el profesor {selectProfe?.name}?</p>
        <div className="btn-container">
          <button type="submit" style={{backgroundColor:"#ff7474"}}>Borrar</button>
          <button type="button" onClick={()=> setOpenModalProfeDelete(false)}>Cancelar</button>
        </div>
      </form>
    </Modal>)}
    </>
  );
}

export { Mundialito };
