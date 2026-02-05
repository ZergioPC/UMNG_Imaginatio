import styles from "./styles.module.css";

import IconBurger from "../Icons/IconBurger";
import IconAccount from "../Icons/IconAccount";
import IconClose from "../Icons/IconClose";

import { useState, useEffect } from "react";

const API = "/api";

const navContent = [
  {txt:"Home", link:"/"},
  {txt:"Mascota", link:"/mascota"},
  {txt:"Quienes Somos", link:"/about"},
  {txt:"Concursos", link:"/concursos"},
  {txt:"Eventos Pasados", link:"/eventos-pasados"},
  {txt:"Edición 2026", link:"/2026"},
];

function Header(){
  const [asideMenu, setAsideMenu] = useState(false);
  const [asidePerfil, setAsidePerfil] = useState(false);
  const [teamData, setTeamData] = useState();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(()=>{
    fetch(API + "/equipo/get-data", {
      method: 'POST',
      credentials:"include"
    })
    .then(response => response.json())
    .then(data => {            
      if(data.message){
        setIsLogged(true);        
        setTeamData(data.data[0]);
      }
    })
    .catch(error => {
        console.error('Errora:', error);
    });
  },[]);

  return (<>
    <header className={styles.Header}>
      <div>
        <button
          onClick={()=> setAsideMenu(true)}
        >
          <IconBurger color="var(--ui-color)"/>
        </button>
        <a href="/">Imaginatio</a>
      </div>
      <button
        onClick={()=> setAsidePerfil(true)}
      >
        <IconAccount color="var(--ui-color)"/>
      </button>
    </header>

    <aside 
      className={[
        styles.Menu, 
        asideMenu ? styles.Menu_Show : ""
      ].join(" ")}
    >
      <button
        onClick={()=> setAsideMenu(false)}
      >
        <IconClose color="var(--ui-color)"/>
      </button>
      <nav>
        {navContent.map((page, idx) => 
          <a key={idx} href={page.link}>{page.txt}</a>
        )}
      </nav>
    </aside>

    <aside 
      className={[
        styles.Perfil, 
        asidePerfil ? styles.Perfil_Show : ""
      ].join(" ")}
    >
      <button
        onClick={()=> setAsidePerfil(false)}
      >
        <IconClose color="var(--ui-color)"/>
      </button>
      {isLogged ? (
        <div>
          <span>{teamData ? teamData?.publicName : "Equipo"}</span>
          <picture>
            <img 
              src={teamData ? API +teamData?.img : "none"}
              alt={`Foto de Perfil de ${teamData ? teamData?.publicName : ""}`}
            />
          </picture>
          <a href="/equipos-panel">Panel de Equipo</a>
        </div>
      ) : (
        <div>
          <a href="/login">Iniciar Sesión</a>
          <a href="#" target="_blank">Crear Equipo</a>
        </div>
      )}
    </aside>
  </>);
}

export { Header };