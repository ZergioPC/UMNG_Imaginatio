import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import "./TorneoPanel.css";

import torneoDoodleVideo from "../../../assets/mundialito/FutbolDoodle.webm";

//import { Home } from "../AdminPanelComponents/Pages/Home";
//import { EventosEquipos } from "../AdminPanelComponents/Pages/EventosEquipos";
//import { Apariencia } from "../AdminPanelComponents/Pages/Apariencia";

function Partido(){
  return (<>
    <h1>Partido</h1>
  </>);
}

function Home(){
  return (<>
    <h1>Brackets</h1>
    <video autoPlay muted>
      <source src={torneoDoodleVideo} type='video/webm'/>
    </video>
    <a href="/mundialito-inscripcion">Inscribete</a>
  </>);
}

function Equipos(){
  return (<>
    <h1>Equipos</h1>
    <Link to="/partido">Partido</Link>
  </>);
}

const links = [
  {to:"/", txt:"Torneo", element:Home},
  {to:"/equipos", txt:"Equipos", element:Equipos},
]

function TorneoPanel() {
  return (
    <HashRouter>
      <div className="Torneo-nav">
        <nav>
          {links.map((link,idx) => 
            <NavLink 
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >{link.txt}</NavLink>
          )}
        </nav>
      </div>
      <div className="Torneo-Content">
        <Routes>
          {links.map((link,idx) => 
            <Route 
              key={idx}
              path={link.to} 
              element={<link.element />} 
            />
          )}
          <Route path="/partido" element={<Partido />}/>
        </Routes>
      </div>
    </HashRouter>
  );
}

export { TorneoPanel };