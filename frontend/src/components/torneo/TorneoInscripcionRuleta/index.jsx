import React from "react";
import styles from "./styles.module.css";

import RuletaWallpaper from "@/assets/mundialito/Escenario_Ruleta.jpg";
import RuletaLuz from "@/assets/mundialito/luz_foco.png";

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

function TorneoInscripcionRuleta({ pais, onComplete }) {
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
    }, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pais]);

  return (
    <div className={styles.ModalRuleta}>
      <span></span>
      <main>
        <img className={styles.BgImage} src={RuletaWallpaper.src} alt="Ruleta Wallpaper" />
        <div className={styles.container}>
          <div className={`${styles.borde} ${isSpinning ? styles.spinning : ''}`}>
            <img 
              src={`/banderas/${banderas_path[currentFlag]}`} 
              alt="banderas" 
              className={styles.bandera}
            />
          </div>
          {!isSpinning && (
            <>
            <p>{pais}</p>
            <button className={styles.AcceptBtn} onClick={onComplete}>Aceptar</button>
            </>
          )}
        </div>
        <img className={styles.Foco1} src={RuletaLuz.src} alt="Foco 1" />
        <img className={styles.Foco2} src={RuletaLuz.src} alt="Foco 2" />
        <img className={styles.Foco3} src={RuletaLuz.src} alt="Foco 3" />
        <img className={styles.Foco4} src={RuletaLuz.src} alt="Foco 4" />
      </main>
    </div>
  );
}

export { TorneoInscripcionRuleta };
