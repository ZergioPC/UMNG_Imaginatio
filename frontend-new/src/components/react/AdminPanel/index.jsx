import { HashRouter, Routes, Route, Link } from 'react-router-dom';

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

function App() {
  return (
    <HashRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/apariencia">Apariencia</Link>
        <Link to="/eventos-y-equipos">Eventos y Equipos</Link>
        <Link to="/publicaciones">Publicaciones</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apariencia" element={<Apariencia />} />
        <Route path="/eventos-y-equipos" element={<EventosEquipos />} />
        <Route path="/publicaciones" element={<Publicaciones />} />
      </Routes>
    </HashRouter>
  );
}

export { App };