import { HashRouter, Routes, Route, NavLink, useParams } from 'react-router-dom';

import "./TorneoPanel.css";

import wallpaper from "../../../assets/mundialito/futbol_field.webp";

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
  {to:"/equipos/:id", txt:"Equipos", element:Equipos},
]

function TorneoPanel() {
  return (
    <HashRouter>
      <div 
        className="Torneo-Content"
        style={{backgroundImage: `url(${wallpaper.src})`}}
      >
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