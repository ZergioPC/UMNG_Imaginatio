import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './Home.css';

import videoTorneoDoodle from "../../../../../assets/mundialito/FutbolDoodle.webm";

const API = typeof GLOBALS !== 'undefined' ? GLOBALS.API : '/api';

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

function Team({ name, score, isWinner }) {
  const flag = getFlag(name);
  
  return (
    <div className={`team team-${name} ${isWinner ? 'winner' : ''}`}>
      {flag && <img src={flag} alt={name} className="team-flag" />}
      <span className="team-name">{name || 'TBD'}</span>
      {score !== null && score !== undefined && (
        <span className="team-score">{score}</span>
      )}
    </div>
  );
}

function Match({ match}) {
  if (!match) {
    return (
      <div className="match">
        <div className="team team-tbd"><span className="team-name">TBD</span></div>
        <div className="team team-tbd"><span className="team-name">TBD</span></div>
      </div>
    );
  }
  const navigate = useNavigate();

  const winnerId = match.winner;
  const team1IsWinner = winnerId && match.equipo_1 === winnerId;
  const team2IsWinner = winnerId && match.equipo_2 === winnerId;

  const handleRedirect = ()=> {
    if (match.id !== 0) navigate(`/partido/${match.id}`);
  }

  return (
    <div 
      className="match"
      onClick={handleRedirect}
      style={{"cursor":"pointer"}}
    >
      <Team name={match.equipo_1_name} score={match.equipo_1_score} isWinner={team1IsWinner} />
      <Team name={match.equipo_2_name} score={match.equipo_2_score} isWinner={team2IsWinner} />
    </div>
  );
}

function Round({ matches, title, expectedMatches = 1 }) {
  const matchesArray = matches || [];
  const emptySlots = Math.max(0, expectedMatches - matchesArray.length);
  const emptyMatches = Array(emptySlots).fill(null);
  
  return (
    <div className="round">
      {title && <div className="round-title">{title}</div>}
      {matchesArray.map((match, idx) => <Match key={idx} match={match} />)}
      {emptyMatches.map((_, idx) => <Match key={`empty-${idx}`} match={null} />)}
    </div>
  );
}

function Spacer({ width = 40 }) {
  return <div className="round-spacer" style={{ width }} />;
}

async function fetchFaseData(faseId) {
  try {
    const response = await fetch(`${API}/torneo_fase/get/${faseId}`);
    if (!response.ok) throw new Error(`Error fase ${faseId}`);
    const data = await response.json();
    return data.partidos || [];
  } catch (error) {
    console.error(`Error fetching fase ${faseId}:`, error);
    return [];
  }
}

async function fetchTeamsData() {
  try {
    const response = await fetch(`${API}/torneo_team/get`);
    if (!response.ok) throw new Error(`Error al cargar equipos`);
    const data = await response.json();
    return data.data;
  } catch (e) {
    console.log(e);
  }
}

function Home() {
  const [faseData, setFaseData] = useState({});
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [intro,setIntro] = useState(true);
  const [isTeamsDisponibles, setIsTeamDisponible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const fases = {};
        const teams = await fetchTeamsData();
        for (let i = 1; i <= 8; i++) {
          fases[i] = await fetchFaseData(i);
        }
        setFaseData(fases);
        setTeamsData(teams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    fetch(API + "/torneo_utils/teams-disponibles")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setIsTeamDisponible(data.data);
      });
    }, []);

  setTimeout(()=>{
    setIntro(false);
  },5100);

  if (loading) return (
    <div className="bracket-container">
      <div className="loading">Cargando bracket...</div>
    </div>
  );
  if (error) return (
    <div className="bracket-container">
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <>
    {/* DOODLE */}
    <div className={intro ? "doodle" : "doodle doodle-small"}>
      <span></span>
      <video autoPlay muted>
        <source src={videoTorneoDoodle} type='video/webm'/>
      </video>
    </div>

    {/* BRACKET */}
    <div className="bracket-container">
      <h1 className="bracket-title">Torneo de Doble Eliminación</h1>
      
      <div className="bracket">
        <div>
          <Round title="Ronda 1" matches={faseData[1]} expectedMatches={4} />
        </div>

        <div>
          <Round title="Winners 1" matches={faseData[2]} expectedMatches={2} />
          <Spacer width={20} />
          <Round title="Lowers 1" matches={faseData[3]} expectedMatches={2} />
        </div>

        <div className="bracket-bottom">
          <Round title="Lowers 2" matches={faseData[4]} expectedMatches={2} />
        </div>
        
        <div className="bracket-top">
          <Round title="Winners 2" matches={faseData[5]} expectedMatches={1} />
          <Spacer width={20} />
          <Round title="Lower 3" matches={faseData[6]} expectedMatches={1} />
        </div>

        <div className="bracket-bottom">
          <Round title="Lowers Final" matches={faseData[7]} expectedMatches={2} />
        </div>

        <div>
          <Round title="Gran Final" matches={faseData[8]} expectedMatches={1} />
        </div>
      </div>
    </div>

    {/* Inscribirse */}
    <div 
      className={isTeamsDisponibles ? "inscripcion" : "inscipcion off"}
    >
      <a href="/mundialito-inscripcion">Inscribete</a>
    </div>

    {/* VER EQUIPOS */}
    <div className="equipos-container">
      {teamsData.map(team =>
        <article 
          className="equipo-card"
          onClick={()=> navigate(`/equipos/${(team.id)}`)}
        >
          <img src={getFlag(team.name)} alt="" srcset="" />
          <span>{team.name}</span>
        </article>
      )}
    </div>
    </>
  );
}

export { Home };
