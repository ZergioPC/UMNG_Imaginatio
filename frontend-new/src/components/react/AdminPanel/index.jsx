import "./styles.css";
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';

import { EventosEquipos } from "../AdminPanelComponents/Pages/EventosEquipos";
import { Apariencia } from "../AdminPanelComponents/Pages/Apariencia";
import { Publicaciones } from "../AdminPanelComponents/Pages/Publicaciones";
import { Home } from "../AdminPanelComponents/Pages/Home";

const links = [
  {to:"/", txt:"Home", element:Home},
  {to:"/apariencia", txt:"Apariencia", element:Apariencia},
  {to:"/eventos-y-equipos", txt:"Eventos y Equipos", element:EventosEquipos},
  {to:"/publicaciones", txt:"Publicaciones", element:Publicaciones},
]

function App() {
  return (
    <HashRouter>
      <div className="App-Nav">
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
      <div className="App-Content">
        <Routes>
          {links.map((link,idx) => 
            <Route 
              key={idx}
              path={link.to} 
              element={<link.element />} 
            />
          )}
        </Routes>
      </div>
    </HashRouter>
  );
}

export { App };