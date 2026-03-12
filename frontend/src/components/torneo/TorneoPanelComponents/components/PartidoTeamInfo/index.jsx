import styles from "./styles.module.css"

function PartidoTeamInfo({ name, imgUrl, isWinner }) {
  return (
    <div className={styles.PartidoteamInfo}>
      {isWinner && <span className={styles.PartidoBadge}>Ganador</span>}
      <figure
        className={styles.PartidoteamLogo}
      >
        <img 
          src={imgUrl || '/default-team.png'} 
          alt={name} 
        />
      </figure>
      <span className={styles.PartidoteamName}>{name || 'Por definir'}</span>
    </div>
  );
}

export { PartidoTeamInfo };
