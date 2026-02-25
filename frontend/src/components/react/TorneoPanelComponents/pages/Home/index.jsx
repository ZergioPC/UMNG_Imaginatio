import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bracket.css';

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
    <div className={`team ${isWinner ? 'winner' : ''}`}>
      {flag && <img src={flag} alt={name} className="team-flag" />}
      <span className="team-name">{name || 'TBD'}</span>
      {score !== null && score !== undefined && (
        <span className="team-score">{score}</span>
      )}
    </div>
  );
}

function Match({ match}) {
  const navigate = useNavigate();

  if (!match) {
    return (
      <div className="match">
        <div className="team team-tbd"><span className="team-name">TBD</span></div>
        <div className="team team-tbd"><span className="team-name">TBD</span></div>
      </div>
    );
  }

  const winnerId = match.winner;
  const team1IsWinner = winnerId && match.equipo_1 === winnerId;
  const team2IsWinner = winnerId && match.equipo_2 === winnerId;

  console.log(match);

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
    const response = await fetch(`${API}/torneo_fase/get/${faseId}`, { credentials: 'include' });
    if (!response.ok) throw new Error(`Error fase ${faseId}`);
    const data = await response.json();
    return data.partidos || [];
  } catch (error) {
    console.error(`Error fetching fase ${faseId}:`, error);
    return [];
  }
}

function Home() {
  const [faseData, setFaseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const fases = {};
        for (let i = 1; i <= 8; i++) {
          fases[i] = await fetchFaseData(i);
        }
        setFaseData(fases);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="bracket-container"><div className="loading">Cargando bracket...</div></div>;
  if (error) return <div className="bracket-container"><div className="error">Error: {error}</div></div>;

  return (
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
  );
}

export { Home };
