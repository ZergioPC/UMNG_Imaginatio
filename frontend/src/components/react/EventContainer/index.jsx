import { useState, useEffect } from 'react';

import styles from './styles.module.css';
import ArrowLeft from "../Icons/ArrowLeft";

import ReactMarkdown from "react-markdown";

import GLOBALS from "../../../../public/js/globals.js";

const API = GLOBALS.API;

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
    <a
      className={styles.TeamItem} 
      href={`/equipos?id=${id}`}
    >
      <img src={API + image} alt={"Foto de perfil del equipo " + id} />
      <div>
        <span>{name}</span>
      </div>
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

      {/* Lista de Eventos */}
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
      
      {/* Evento Info */}
      <section 
        className={
          `${styles.EventInfo} ${viewInfo ? styles.open : ""}`
        }
        style={{"display": select ? "block" : "none"}}
      >
        <button
          className={styles.EventInfoBtn}
          onClick={()=> {
            setViewInfo(false);
          }}
        >
          <ArrowLeft color="var(--interactive-default)"/>
        </button>

        <h2>{select?.name ?? "Name"}</h2>
        <div className={styles.EventInfoText}>
          <ReactMarkdown>{select?.desc ?? "Desc"}</ReactMarkdown>
        </div>
        {teams ? (
          <div className={styles.EventInfoContainer}>
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
          <a 
            href="#"
            className={styles.EventInfoInscribir}
          >!Participa aquí!</a>
        )}
      </section>
    </div>
  );
}

export { EventContainer };