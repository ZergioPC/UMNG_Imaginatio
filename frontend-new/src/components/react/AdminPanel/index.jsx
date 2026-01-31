import "./styles.css";
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function Apariencia() {
  return <h2>Apariencia</h2>;
}

function EventosEquipos() {
  return <h2>Eventos y Equipos</h2>;
}

function Publicaciones() {
  return <h2>Publicaciones</h2>;
}

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
          {links.map(link => 
            <NavLink 
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
          {links.map(link => 
            <Route path={link.to} element={<link.element />} />
          )}
        </Routes>
      </div>
    </HashRouter>
  );
}

export { App };