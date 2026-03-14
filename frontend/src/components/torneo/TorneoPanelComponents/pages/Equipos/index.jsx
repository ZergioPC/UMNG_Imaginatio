import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import IconBack from '@/components/icons/react/IconBack';

import { BtnReturn } from '../../components/BtnReturn';
import { BtnAviso } from '@/components/buttons/BtnAviso';

import './Equipos.css';

import imgProfeAnonimo from "@/assets/mundialito/profe_anonimo.png"
import GLOBALS from "@/config/globals.js";

const API = GLOBALS.API || '/api';

const FLAG_MAP = {
  'alemania': '/banderas/ALEMANIA.png',
  'argentina': '/banderas/ARGENTINA.png',
  'brasil': '/banderas/BRASIL.png',
  'colombia': '/banderas/COLOMBIA.png',
  'españa': '/banderas/ESPAÑA.png',
  'espana': '/banderas/ESPAÑA.png',
  'francia': '/banderas/FRANCIA.png',
  'japon': '/banderas/JAPON.png',
  'japón': '/banderas/JAPON.png',
  'mexico': '/banderas/MEXICO.png',
  'méxico': '/banderas/MEXICO.png',
  'noruega': '/banderas/NORUEGA.png',
  'peru': '/banderas/PERU.png',
  'perú': '/banderas/PERU.png',
};

function getFlag(teamName) {
  if (!teamName) return null;
  const normalized = teamName.toLowerCase().trim();
  const flagPath = FLAG_MAP[normalized];
  return flagPath || null;
}

function Equipos() {
  const { id } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/torneo_team/get/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setTeamData(data.data);
    }).catch(error => console.error('Error fetching team:', error))
    .finally(()=> setLoading(false))
  }, [id]);

  if (loading) {
    return <div className="app-loading">Cargando equipo...</div>;
  }

  if (!teamData) {
    return (
    <>
      <button 
        className='btn-return'
        onClick={()=> navigate("/")}
      >
        <IconBack color='#fff'/>
      </button>
      <div className="app-error">Equipo no encontrado</div>);
    </>
    )
  }

  const { team, profesor, players } = teamData;

  const playersList = (players || []).map(p => ({ ...p, role: 'Jugador' }));

  return (
    <div className="app-container">
      
      <BtnReturn />

      <div className="app-info-container">
        <div className="app-info-pais">
          <figure>
            <img src={getFlag(team.name)} alt="" />
          </figure>
          <h2 className="app-info-pais-name">{team.name}</h2>
        </div>

        {profesor ? (
          <div 
            className={`app-profesor ${hoveredPerson?.role === 'Profesor' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredPerson({ ...profesor, role: 'DT' })}
          >
            <img 
              src={API + profesor.img_url} 
              alt={profesor.name}
              className="app-profesor-img"
            />
            <span className="app-profesor-name">{profesor.name}</span>
            <span className="app-profesor-role">DT</span>
          </div>
        ) : (
           <div 
            className="app-profesor"
          >
            <img 
              src={imgProfeAnonimo.src} 
              alt="Profesor incognito"
              className="app-profesor-img"
            />
            <span className="app-profesor-name">???</span>
            <span className="app-profesor-role">DT</span>
          </div>
        )}
      </div>

      <div className="app-detalle">
        {hoveredPerson ? (
          <>
            <img 
              src={API + hoveredPerson.img_url} 
              alt={hoveredPerson.name}
              className="app-detalle-img"
            />
            <h2 className="app-detalle-name">{hoveredPerson.name}</h2>
            <span className="app-detalle-role">{hoveredPerson.role}</span>
          </>
        ) : (
          <div className="app-detalle-placeholder">
            <p>Pasa el cursor sobre una imagen para ver los detalles</p>
          </div>
        )}
      </div>

      <div className="app-grid">
        {playersList.length !== 0 ? (
          playersList.map((player, idx) => (
            <div
              key={idx}
              className={`app-grid-item ${hoveredPerson === player ? 'active' : ''}`}
              onMouseEnter={() => setHoveredPerson(player)}
            >
              <img 
                src={API + player.img_url} 
                alt={player.name}
                className="app-grid-img"
              />
            </div>
          ))
        ) : (
          <div className="app-grid-empty">
            <p>No hay jugadores inscritos en este equipo!</p>
            <BtnAviso>
              <a href="/mundialito-inscripcion">Inscribete</a>
            </BtnAviso>
          </div>
        )}
      </div>
    </div>
  );
}

export { Equipos };
