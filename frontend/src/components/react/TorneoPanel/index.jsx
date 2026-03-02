import { HashRouter, Routes, Route, NavLink, useParams } from 'react-router-dom';

import "./TorneoPanel.css";

import wallpaper from "../../../assets/mundialito/futbol_field.webp";

import { Home } from '../TorneoPanelComponents/pages/Home';
import { Equipos } from '../TorneoPanelComponents/pages/Equipos';
import { Partido } from '../TorneoPanelComponents/pages/Partido';

function TorneoPanel() {
  return (
    <HashRouter>
      <div 
        className="Torneo-Content"
        style={{backgroundImage: `url(${wallpaper.src})`}}
      >
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/equipos/:id" element={<Equipos />}/>
          <Route path="/partido/:id" element={<Partido />}/>
        </Routes>
      </div>
    </HashRouter>
  );
}

export { TorneoPanel };