import { useState, useEffect, useRef } from "react";
import { TorneoInscripcionRuleta } from "../TorneoInscripcionRuleta";

import imageCompression from "browser-image-compression";

import styles from "./styles.module.css";
import GLOBALS from "../../../../public/js/globals";

const API = GLOBALS.API;

function generateUserFields(imagePreviews, handleImageChange) {
  const fields = [];
  for (let i = 1; i <= 6; i++) {
    fields.push(
      <div key={i} className={styles.Form}>
        <div className={styles.FormInputs}>
          <h3>Jugador {i}</h3>
          <label>
            <input 
              required 
              type="text" 
              name={`user${i}_name`} 
              placeholder="Nombre del Jugador"
            />
          </label>
          <label>
            <span>Foto del Jugador</span>
            <input 
              required 
              type="file" 
              name={`user${i}_photo`} 
              accept="image/*" 
              onChange={(e) => handleImageChange(i, e)} 
            />
          </label>
        </div>
        <div className={styles.imagePreview}>
          {imagePreviews[i] && (
            <img src={imagePreviews[i]} alt={`Jugador ${i}`} />
          )}
        </div>
      </div>
    );
  }
  return fields;
}

function TorneoInscripcion(){
  const [message, setMessage] = useState("");
  const [isTeamDisponible, setIsTeamDisponible] = useState(false);
  const [isFulled, setIsFulled] = useState(false);

  const [selectTeam, setSelectTeam] = useState(null);
  const [showRuleta, setShowRuleta] = useState(false);
  
  const [imagePreviews, setImagePreviews] = useState({});
  const imageUrlsRef = useRef([]);

  const handleImageChange = (playerNumber, e) => {
    const file = e.target.files[0];
    if (file) {
      if (imageUrlsRef.current[playerNumber]) {
        URL.revokeObjectURL(imageUrlsRef.current[playerNumber]);
      }
      const objectUrl = URL.createObjectURL(file);
      imageUrlsRef.current[playerNumber] = objectUrl;
      setImagePreviews((prev) => ({
        ...prev,
        [playerNumber]: objectUrl,
      }));
    }
  };

  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  useEffect(() => {
    fetch(API + "/torneo_utils/teams-disponibles")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setIsTeamDisponible(data.data);
        setSelectTeam(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFulled(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      for (let i = 1; i <= 6; i++) {
        const imageFile = formData.get(`user${i}_photo`);
        if (imageFile && imageFile.size > 0) {
          const compressedFile = await imageCompression(imageFile, {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            initialQuality: 0.75,
          });
          formData.set(`user${i}_photo`, compressedFile);
        }
      }
    } catch (error) {
      console.log(error);
      setIsFulled(false);
    }

    await fetch(API + "/torneo_players/crear", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectTeam(data.asigned);
        setShowRuleta(true);
        setMessage(data.message);
        form.reset();
      });
  };
    
  // RETURN
  if (isTeamDisponible) {
    return (
      <>
      <section className={styles.TorneoInscripcion}>
        {isFulled ? (
          <section className={styles.TorneoInscripcionOff}>
            <p 
              className={styles.TorneoMessage}
            >Cargando ruleta de equipo...</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit}>
            {generateUserFields(imagePreviews, handleImageChange)}
            <button type="submit">Inscribir Equipo</button>
            {message && <p className={styles.TorneoMessage}>{message}</p>}
          </form>
        )}
      </section>
      {showRuleta &&
        <TorneoInscripcionRuleta 
          pais={selectTeam || ""}
          onComplete={()=> {
            setShowRuleta(false);
            console.log("Cerrar Ruleta");
          }}
        />
      }
      </>
    );
  } else {
    return (<section className={styles.TorneoInscripcionOff}>
    <p className={styles.TorneoMessage}>Los equipos están completos...</p>
  </section>);
  }
}

export { TorneoInscripcion };
