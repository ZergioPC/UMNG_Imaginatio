import styles from "./styles.module.css";

import IconBurger from "@/components/icons/react/IconBurger";
import IconAccount from "@/components/icons/react/IconAccount";
import IconClose from "@/components/icons/react/IconClose";

import { useState, useEffect } from "react";

import GLOBALS from "@/config/globals.js";

const API = GLOBALS.API;

const navContent = [
  {txt:"Home", link:"/"},
  {txt:"Qué es el Imaginatio", link:"/about"},
  {txt:"Concursos", link:"/concursos"},
  {txt:"Eventos Pasados", link:"/eventos-pasados"},
  {txt:"Mundialito", link:"/mundialito"}
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