import { HashRouter, Routes, Route, NavLink, useParams } from 'react-router-dom';

import "./TorneoPanel.css";

import { Home } from '../TorneoPanelComponents/pages/Home';
//import { EventosEquipos } from "../AdminPanelComponents/Pages/EventosEquipos";
//import { Apariencia } from "../AdminPanelComponents/Pages/Apariencia";

function Partido(){
  const { id } = useParams();
  return (<>
    <h1>Partido {id}</h1>
  </>);
}

function Equipos(){
  return (<>
    <h1>Equipos</h1>
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
          <Route path="/partido/:id" element={<Partido />}/>
        </Routes>
      </div>
    </HashRouter>
  );
}

export { TorneoPanel };