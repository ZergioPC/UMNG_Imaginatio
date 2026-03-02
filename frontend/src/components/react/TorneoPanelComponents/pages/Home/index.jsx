import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

import { LogotipoHeader } from '../../components/LogotipoHeader';
import { VideoLoading } from '../../components/VideoLoading';
import { BtnAviso } from '../../../BtnAviso';

import './Home.css';

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

function Match({ match, teamsData }) {
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

  //console.log(match);

  const getTeamIdByName = (name) => {
    if (!name) return null;
    const team = teamsData?.find(t => t.name === name);    
    return team.id ?? -1;
  }
  
  const team1IsWinner = winnerId && getTeamIdByName(match.equipo_1_name) === winnerId;
  const team2IsWinner = winnerId && getTeamIdByName(match.equipo_2_name) === winnerId;

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

function Round({ matches, teamsData, title, expectedMatches = 1 }) {
  const matchesArray = matches || [];
  const emptySlots = Math.max(0, expectedMatches - matchesArray.length);
  const emptyMatches = Array(emptySlots).fill(null);
  
  return (
    <div className="round">
      {title && <div className="round-title">{title}</div>}
      {matchesArray.map((match, idx) => <Match key={idx} match={match} teamsData={teamsData} />)}
      {emptyMatches.map((_, idx) => <Match key={`empty-${idx}`} match={null} teamsData={teamsData} />)}
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
        setTimeout(()=> setLoading(false),4000)
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

  if (loading) return (
    <div className="bracket-container">
      <VideoLoading />
    </div>
  );
  if (error) return (
    <div className="bracket-container">
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <>
    {/* HEADER */}
    <LogotipoHeader titulo={"Bracket del Torneo"}/>

    {/* BRACKET */}
    <div className="bracket-container">
      <div className="bracket">
        <div>
          <Round title="Ronda 1" matches={faseData[1]} teamsData={teamsData} expectedMatches={4} />
        </div>

        <div>
          <Round title="Winners 1" matches={faseData[2]} teamsData={teamsData} expectedMatches={2} />
          <Spacer width={20} />
          <Round title="Lowers 1" matches={faseData[3]} teamsData={teamsData} expectedMatches={2} />
        </div>

        <div className="bracket-bottom">
          <Round title="Lowers 2" matches={faseData[4]} teamsData={teamsData} expectedMatches={2} />
        </div>
        
        <div className="bracket-top">
          <Round title="Winners 2" matches={faseData[5]} teamsData={teamsData} expectedMatches={1} />
          <Spacer width={20} />
          <Round title="Lower 3" matches={faseData[6]} teamsData={teamsData} expectedMatches={1} />
        </div>

        <div className="bracket-bottom">
          <Round title="Lowers Final" matches={faseData[7]} teamsData={teamsData} expectedMatches={1} />
        </div>

        <div>
          <Round title="Gran Final" matches={faseData[8]} teamsData={teamsData} expectedMatches={1} />
        </div>
      </div>
    </div>

    {/* Inscribirse */}
    <div className="inscripcion">
      {isTeamsDisponibles ? (
        <>
        <p>¿Quieres particiapr?</p>
        <BtnAviso>
          <a href="/mundialito-inscripcion">Inscribete</a>
        </BtnAviso>
        </>
      ) : (
        <p>Los equipos ya están completos</p>
      )}
    </div>

    {/* VER EQUIPOS */}
    <div className="equipos-list-container">
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
