import styles from "./styles.module.css";
import { BtnAviso } from "../../../BtnAviso";

const API = typeof GLOBALS !== 'undefined' ? GLOBALS.API : '/api';

function PlayerList({ players, profesor }) {
  if (!players || players.length === 0) {
    return (
      <div className={styles.NoPlayersSection}>
        <p>No hay jugadores registrados!</p>
        <BtnAviso>
          <a href="/mundialito-inscripcion">Inscribete</a>
        </BtnAviso>
      </div>
    );
  }

  console.log(profesor);

  return (
    <div className={styles.PlayersSection}>
      <div className={styles.PlayersProfesor}>
        <figure>
          {profesor ? (
            <img 
              src={API + profesor?.img_url} 
              alt={`Profe ${profesor?.name}`}
            />
          ) : (
            <img 
              src="incognito" alt="Profe Anonimo"
            />
          )}
        </figure>
        <div>
          <p>{profesor ? profesor.name : "Nombre del Profe"}</p>
          <span>DT</span>
        </div>
      </div>
      <div className={styles.PlayersGrid}>
        {players.map((player, index) => (
          <div key={player?.id || index} className={styles.PlayerCard}>
            <img 
              src={player?.img_url || '/default-player.png'} 
              alt={player?.name} 
              className={styles.PlayerImg}
            />
            <span className={styles.PlayerName}>{player?.name || 'Jugador'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { PlayerList };
