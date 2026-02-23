import React from "react";
import styles from "./styles.module.css";

const banderas_path = {
  ALEMANIA: "ALEMANIA.png",
  ARGENTINA: "ARGENTINA.png",
  BRASIL: "BRASIL.png",
  COLOMBIA: "COLOMBIA.png",
  ESPAÑA: "ESPAÑA.png",
  FRANCIA: "FRANCIA.png",
  JAPÓN: "JAPON.png",
  MÉXICO: "MEXICO.png",
  NORUEGA: "NORUEGA.png",
  PERÚ: "PERU.png",
}

const paises = Object.keys(banderas_path);

function TorneoInscripcionRuleta({ pais }) {
  const [currentFlag, setCurrentFlag] = React.useState(paises[0]);
  const [isSpinning, setIsSpinning] = React.useState(false);

  React.useEffect(() => {
    if (!pais) return;

    setIsSpinning(true);
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * paises.length);
      setCurrentFlag(paises[randomIndex]);
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCurrentFlag(pais);
      setIsSpinning(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pais]);

  return (
    <div className={styles.container}>
      <div className={`${styles.borde} ${isSpinning ? styles.spinning : ''}`}>
        <img 
          src={`/banderas/${banderas_path[currentFlag]}`} 
          alt="banderas" 
          className={styles.bandera}
        />
      </div>
      {!isSpinning && <p>{pais}</p>}
    </div>
  );
}

export { TorneoInscripcionRuleta };
