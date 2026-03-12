import styles from "./styles.module.css";
import Logotipo from "../../../../../assets/mundialito/LOGOTIPO_Mundialito_web.webp";

function LogotipoHeader({ titulo }){
  return (
    <div className={styles.LogotipoHeader}>
      <img src={Logotipo.src} alt="Logotipo Mundialito" />
      {titulo && <h1>{titulo}</h1>}
    </div>
  );
}

export { LogotipoHeader };