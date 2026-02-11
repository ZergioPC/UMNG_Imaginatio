import styles from "./styles.module.css";

import { useState, useEffect } from "react";
import { PostsContainer } from "../PostsContainer";
import { EquipoInfoTeamView } from "../EquipoInfoTeamView";

import IconClose from "../Icons/IconClose";
import SocialMail from "../Icons/SocialEmail";
import SocialPhone from "../Icons/SocialPhone";
import SocialInstagram from "../Icons/SocialInstagram";
import SocialTiktok from "../Icons/SocialTiktok";
import SocialTwitter from "../Icons/SocialTwiter";

import GLOBALS from "../../../../public/js/globals.js";

const API = GLOBALS.API;

// TITULO
function Titulo({ name, image }){
  return (
    <section className={styles.Titulo}>
      <picture>
        <img 
          alt={"Foto del equipo " + name}
          src={API + image || "/api/uploads/users/idle.jpg"} 
        />
      </picture>
      <h1>{name}</h1>
    </section>
  );
}

// MARK: INTEGRANTES
function Integrantes({ students }) {
  const [twist, setTwist] = useState(false);
  const [select, setSelect] = useState(null);

  return (
    <div className={styles.CardContainer}>
      <div className={`${styles.CardInner} ${twist ? styles.CardFlipped : ''}`}>
        {/* Front side - Integrantes */}
        <section 
          className={`${styles.Integrantes} ${twist ? styles.Hide : ''}`}
        >
          <h2>Integrantes</h2>
          <EquipoInfoTeamView 
            members={students} 
            onMemberClick={(member) => {
              setSelect(member);
              setTwist(true);
            }}
          />
        </section>

        {/* Back side - Estudiante Info */}
        <section 
          className={`${!twist ? styles.Hide : ''}`}
        >
          <button 
            className={styles.EstudianteInfoBtn}
            onClick={() => setTwist(false)}
          >
            <IconClose color="#000" />
          </button>
          <div className={`${styles.EstudianteInfo} `}>
            <picture>
              <img
                src={API + select?.img || "/api/uploads/users/idle.jpg"}
                alt={"Foto de perfil de " + select?.name}
              />
            </picture>
            <div>
              <h3>{select?.name || "Nombre de Estudiante"}</h3>
              <span>Codigo {select?.codigo || "6000777"}</span>
              <p>{select?.desc || "Descripcion"}</p>
              <ul>
                {select?.email && (
                  <li>
                    <a href={`mailto:${select.email}`} target="_blank" rel="noopener noreferrer">
                      <picture>
                        <SocialMail color="var(--brand-primary)" />
                      </picture>
                      <span>Email</span>
                    </a>
                  </li>
                )}
                {select?.phone && (
                  <li>
                    <a href={`tel:${select.phone}`} target="_blank" rel="noopener noreferrer">
                      <picture>
                        <SocialPhone color="var(--brand-primary)" />
                      </picture>
                      <span>+57 {select.phone}</span>
                    </a>
                  </li>
                )}
                {select?.instagram && (
                  <li>
                    <a
                      href={`https://www.instagram.com/${select.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <picture>
                        <SocialInstagram color="var(--brand-primary)" />
                      </picture>
                      <span>{select.instagram}</span>
                    </a>
                  </li>
                )}
                {select?.tiktok && (
                  <li>
                    <a
                      href={`https://www.tiktok.com/@${select.tiktok}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <picture>
                        <SocialTiktok color="var(--brand-primary)" />
                      </picture>
                      <span>{select.tiktok}</span>
                    </a>
                  </li>
                )}
                {select?.twiter && (
                  <li>
                    <a
                      href={`https://www.x.com/${select.twiter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <picture>
                        <SocialTwitter color="var(--brand-primary)" />
                      </picture>
                      <span>{select.twiter}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// MARK: MAIN
function EquipoInfoContainer(){
  const [idTeam, setIdTeam] = useState(0);
  const [teamData, setTeamData] = useState(null);
  const [students, setStudents] = useState(null);

  // GET ID
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIdTeam(searchParams.get("id"));
  }, []);

  // FETCH TEAM DATA
  useEffect(()=>{
    fetch(API + "/equipo/get/" + idTeam)
      .then(res => res.json())
      .then(data => {
        setTeamData(data.data);
      })
      
    fetch(API + "/estudiantes/filter/" + idTeam)
    .then(res => res.json())
    .then(data => {
      setStudents(data.data);
    })
  },[idTeam]);  

  return (
  <>
    <Titulo 
      name={teamData?.publicName ?? ""}
      image={teamData?.img ?? ""}
    />

    <Integrantes 
      students={students ?? []}
    />

    {teamData && (<>
      <h2 className={styles.division}>Publicaciones de {teamData.publicName}</h2>
      <PostsContainer
        endpoint={`/equipo/publicaciones/${teamData.equipo_id}/`}
      />
    </>)}
  </>
);
}

export { EquipoInfoContainer };