import styles from "./styles.module.css";

import { useState, useEffect } from "react";
import { PostsContainer } from "../PostsContainer";

const API = "http://localhost:8000";

// TITULO
function Titulo({ name, image }){
  return (
    <section className={styles.Titulo}>
      <picture>
        <img src={image} alt={"Foto del equipo " + name} />
      </picture>
      <h1>{name}</h1>
    </section>
  );
}

// INTEGRANTES
function Integrantes({ students }){
  return (
    <section className={styles.Integrantes}>
      <h2>Integrantes</h2>
      {students && (<div>
        {students.map(user => 
          <article
            onClick={()=> console.log(user)}
          >
            <picture>
              <img src={user.img} alt={"Foto de " + user.name} />
            </picture>
            <span>{user.name}</span>
          </article>
        )}
      </div>)}
    </section>
  );
}

// MAIN
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
      students={students}
    />

    {teamData && 
      (<h2 className={styles.division}>Publicaciones de {teamData.publicName}</h2>)
    }

    <PostsContainer />

  </>
);
}

export { EquipoInfoContainer };