import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const API = "http://localhost:8000";

function EventItem({ onClick, name}){
  return (
    <button className={styles.EventItem}
      onClick={onClick}
    >
      <span>{name}</span>
    </button>
  );
}

function TeamItem({ id, name, image }){
  return (
    <a href={`/equipos?id=${id}`}>
      <img src={image} alt={"Foto de perfil del equipo " + id} />
      <span>{name}</span>
    </a>
  );
}

function EventContainer() {
  const [select, setSelect] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [teams, setTeams] = useState([]);  

  const [viewInfo, setViewInfo] = useState(false);

  //Fetch Events
  useEffect(()=>{
    fetch(API + "/event/get")
      .then(res => res.json())
      .then(data => {
        setEventos(data.data);
      });
  },[]);

  //Fetch Teams
  useEffect(()=>{
    if (!select) return;
    fetch(API + "/equipo/filter/" + select.evento_id)
      .then(res => res.json())
      .then(data => {
        setTeams(data.data);
      });
  },[select]);

  return (
    <div className={styles.EventContainer}>
      <section className={styles.EventList}>
        {eventos.length !== 0 ? (
          eventos.map((evento, idx) => 
            <EventItem 
              key={idx}
              name={evento.name}
              onClick={()=> {
                setSelect(eventos.find(
                  item => item.evento_id === evento.evento_id
                ));
                setViewInfo(true);
              }}
            />
          )
        ) : (
          <p>No se han creado eventos aún...</p>
        )}
      </section>
      <section 
        className={
          `${styles.EventInfo} ${viewInfo ? styles.open : ""}`
        }
        style={{"display": select ? "block" : "none"}}
      >
        <button
          onClick={()=> {
            setViewInfo(false);
          }}
        >Back</button>

        <h2>{select?.name ?? "Name"}</h2>
        <p>{select?.desc ?? "Desc"}</p>
        {teams ? (
          <div>
            {teams.map((team, idx) => 
              <TeamItem 
                key={idx}
                id={team.equipo_id}
                name={team.publicName}
                image={team.img}
              />
            )}
          </div>
        ) : (
          <>
            <p>Se el primer equipo en inscribirte</p>
            <a href="#">Inscribirse</a>
          </>
        )}
      </section>
    </div>
  );
}

export { EventContainer };