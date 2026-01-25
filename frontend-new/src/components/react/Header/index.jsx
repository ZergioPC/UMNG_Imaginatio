import styles from "./styles.module.css";

import IconBurger from "../Icons/IconBurger";
import IconAccount from "../Icons/IconAccount";

import { useState, useEffect } from "react";

const navContent = [
  {txt:"Mascota", link:"/mascota"},
  {txt:"Quienes Somos", link:"/about"},
  {txt:"Concursos", link:"/actividades"},
  {txt:"Eventos Pasados", link:"/eventos-pasados"},
  {txt:"Edición 2026", link:"/2026"},
];

function Header(){
  const [menu, setMenu] = useState(false);
  const [perfil, setPerfil] = useState(false);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(()=>{
    setIsLogged(true);
  },[]);

  return (<>
    <header className={styles.Header}>
      <div>
        <button
          onClick={()=> setMenu(true)}
        >
          <IconBurger color="#000"/>
        </button>
        <a href="/">Imaginatio</a>
      </div>
      <button
        onClick={()=> setPerfil(true)}
      >
        <IconAccount color="#000"/>
      </button>
    </header>

    <aside 
      className={[
        styles.Menu, 
        menu ? styles.Menu_Show : ""
      ].join(" ")}
    >
      <button
        onClick={()=> setMenu(false)}
      >X</button>
      <nav>
        {navContent.map(page => 
          <a href={page.link}>{page.txt}</a>
        )}
      </nav>
    </aside>

    <aside 
      className={[
        styles.Perfil, 
        perfil ? styles.Perfil_Show : ""
      ].join(" ")}
    >
      <button
        onClick={()=> setPerfil(false)}
      >X</button>
      {isLogged ? (
        <div>
          <span>Equipo</span>
          <picture>
            <img src="" alt="Foto de Perfil del Equipo" />
          </picture>
          <a href="#">Panel de Equipo</a>
        </div>
      ) : (
        <div>
          <a href="#">Iniciar Sesión</a>
          <a href="#" target="_blank">Crear Equipo</a>
        </div>
      )}
    </aside>
  </>);
}

export { Header };