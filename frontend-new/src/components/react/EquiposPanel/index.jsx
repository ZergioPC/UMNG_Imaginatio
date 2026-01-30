import { useState, useEffect } from "react";
import { FormGeneral } from "../EquipoPanelComponents/FormGeneral";

const API = "http://localhost:8000";

function EquipoPanel(){
  const [teamData, setTeamData] = useState(null);
  const [load, setLoad] = useState(true);

  // General Data
  useEffect(()=>{
    if (!load) return;
    fetch(API + '/equipo/get-data',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
    .then(data => {
      setTeamData(data.data[0]);
      setLoad(false);
    })
  },[load]);
  console.log(teamData);

  return (<>
    <section>
      <h2>Información general</h2>
      {!load && (
        <FormGeneral 
          name={teamData ? teamData.publicName : ""}
          description={teamData ? teamData.desc : ""}
          image={teamData ? teamData.img : null}
          endpoint={`${API}/equipo/editar/${teamData.equipo_id}`}
          onReload={()=> setLoad(true)}
        />
      )}
    </section>
  </>);
}

export { EquipoPanel };