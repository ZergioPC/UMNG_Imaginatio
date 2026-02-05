import { useState, useEffect } from "react";

import { FormGeneral } from "../EquipoPanelComponents/FormGeneral";
import { FormEstudiantes } from "../EquipoPanelComponents/FormEstudiantes";
import { FormPost } from "../EquipoPanelComponents/FormPost";

import styles from "./styles.module.css";

const API = "/api";

function EquipoPanel(){
  const [teamData, setTeamData] = useState({
    equipo_id: 0,
    publicName: "Team Name",
    desc: "Descripción",
  });

  const [studentsData, setStudentsData] = useState([]);
  const [postData, setPostData] = useState([]);

  const [load, setLoad] = useState(true);

  // General Data
  useEffect(()=>{
    if (!load) return;
    fetch(API + '/equipo/get-data',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
    .then(data => {
      setTeamData(data.data[0]);
      setLoad(false);
    })
  },[load]);

  // Miembros del equipo
  useEffect(()=>{
    if (teamData.equipo_id === 0) return;
    fetch(API + '/estudiantes/filter/' + teamData.equipo_id,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
    .then(data => {
      setStudentsData(data.data);
      setLoad(false);
    })
  },[teamData]);

  // Publicaciones
  useEffect(()=>{
    if (teamData.equipo_id === 0) return;
    fetch(API + '/equipo/publicaciones/' + teamData.equipo_id, {
      method: 'GET'
    }).then(res => res.json())
    .then(data => {
      setPostData(data.data);
    });
  },[teamData]);

  return (<>
    <section>
      <h2>Información general</h2>
      {!load && (
        <FormGeneral 
          endpoint={`${API}/equipo/editar/${teamData.equipo_id}`}
          name={teamData ? teamData.publicName : ""}
          description={teamData ? teamData.desc : ""}
          image={teamData ? API + teamData.img : null}
          onReload={()=> window.location.reload()}
        />
      )}
    </section>

    <section>
      <h2>Integrantes</h2>
      <FormEstudiantes 
        students={studentsData ?? []}
        endpointCreate={`${API}/estudiantes/crear`}
        endpointDelete={`${API}/estudiantes/delete/`}
        endpointEdit={`${API}/estudiantes/editar/`}
        onReload={()=> setLoad(true)}
      />
    </section>

    <section>
      <h2>Publicaciones</h2>
      <FormPost 
        posts={postData ?? []}
        endpointCreate={`${API}/equipo/publicar`}
        endpointDelete={`${API}/post/delete/`}
        onReload={()=> setLoad(true)}
      />
    </section>
  </>);
}

export { EquipoPanel };