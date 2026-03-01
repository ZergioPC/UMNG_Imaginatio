import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Partido.css';

import { PartidoTeamInfo } from '../../components/PartidoTeamInfo';
import { PlayerList } from '../../components/PlayerList';
import { Scoreboard } from '../../components/Scoreboard';
import { BtnReturn } from '../../components/BtnReturn';

const API = typeof GLOBALS !== 'undefined' ? GLOBALS.API : '/api';

function Partido() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchPartido() {
      try {
        const response = await fetch(`${API}/torneo_partido/get/${id}`);
        if (!response.ok) throw new Error('Error al cargar el partido');
        const result = await response.json();
        console.log(result.data);
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPartido();
  }, [id]);

  if (loading) {
    return <div className="loading">Cargando partido...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data) {
    return <div className="error">Partido no encontrado</div>;
  }

  const { partido, equipo_1, equipo_2, partido:{ winner } } = data;

  const equipo1IsWinner = winner === equipo_1?.team?.id;
  const equipo2IsWinner = winner === equipo_2?.team?.id;

  return (
    <div className="partido-container">
      <BtnReturn />

      <div className="partido-header">
        <h1>Partido</h1>
      </div>

      <div className="partido-main">
        <div className="partido-section partido-team1-info">
          <PartidoTeamInfo 
            name={equipo_1?.team?.name} 
            imgUrl={getTeamImage(equipo_1?.team?.name)}
            isWinner={equipo1IsWinner}
          />
        </div>

        <div className="partido-section partido-team1-players">
          <PlayerList players={equipo_1?.players} profesor={equipo_1?.profesor}/>
        </div>
        <div className="partido-scoreboard">
          <Scoreboard 
            score1={partido?.equipo_1_score} 
            score2={partido?.equipo_2_score} 
          />
        </div>
        <div className="partido-section partido-team2-info">
          <PartidoTeamInfo 
            name={equipo_2?.team?.name} 
            imgUrl={getTeamImage(equipo_2?.team?.name)}
            isWinner={equipo2IsWinner}
          />
        </div>
        <div className="partido-section partido-team2-players">
          <PlayerList players={equipo_2?.players} profesor={equipo_2?.profesor}/>
        </div>
      </div>
    </div>
  );
}

function getTeamImage(teamName) {
  if (!teamName) return null;
  const flagMap = {
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
  const normalized = teamName.toLowerCase().trim();
  return flagMap[normalized] || null;
}

export { Partido };
