import styles from "./styles.module.css";

function Scoreboard({ score1, score2 }) {
  return (
    <div className={styles.Scoreboard}>
      <div className={styles.Score}>
        <span>{score1 ?? 0}</span>
        <span className={styles.ScoreDivider}>vs</span>
        <span>{score2 ?? 0}</span>
      </div>
    </div>
  );
}

export { Scoreboard };
