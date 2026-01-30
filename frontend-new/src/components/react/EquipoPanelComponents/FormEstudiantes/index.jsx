import { useState } from "react";

import IconBack from "../../Icons/IconBack";

import styles from "./styles.module.css";

function RowTable({ name, onEdit, onDelete }){
  return (
    <tr>
      <td>{name}</td>
      <td>
        <button 
          className={styles.btnEdit}
          onClick={onEdit}
        >editar</button>
        <button 
          className={styles.btnDelete}
          onClick={onDelete}
        >borrar</button>
      </td>
    </tr>
  );
}

function AuxFormEdit({ user, onSubmit, onCancel, required=false }) {
  const [nombre, setNombre] = useState(user?.name || "");
  const [codigo, setCodigo] = useState(user?.codigo || "");
  const [email, setEmail] = useState(user?.email || "");

  const [desc, setDesc] = useState(user?.desc || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [twitter, setTwitter] = useState(user?.twitter || "");
  const [tiktok, setTiktok] = useState(user?.tiktok || "");

  const [preview, setPreview] = useState(user?.img || "none");
  const [img, setImg] = useState(null);

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          <span>Nombre</span>
          <input
            type="text"
            name="name"
            required={required}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>

        <label>
          <span>Codigo</span>
          <input
            type="number"
            name="codigo"
            required={required}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            required={required}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          <span>Description</span>
          <textarea
            name="desc"
            rows="4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </label>

        <label>
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label>
          <span>Instagram Username</span>
          <input
            type="text"
            name="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@example"
          />
        </label>

        <label>
          <span>Twitter Username</span>
          <input
            type="text"
            name="twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="@example"
          />
        </label>

        <label>
          <span>TikTok Username</span>
          <input
            type="text"
            name="tiktok"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="@example"
          />
        </label>
      </div>

      <div className={styles.FormPanelImage}>
        <label>
          <span>Foto de Perfil</span>
          {preview && (
            <img src={preview} alt="Profile preview"/>
          )}
          <input
            name="img"
            type="file"
            accept="image/*"
            required={required}
            onChange={(e) => {
              setImg(e.target.files[0])
              setPreview(
                URL.createObjectURL(e.target.files[0])
              )
            }}
          />
        </label>
      </div>

      <section>
        <button type="submit">
          Aceptar
        </button>
        <button onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </form>

  );
}

function FormEstudiantes({ 
  students, endpointDelete, endpointEdit, endpointCreate, onReload
}){
  const [panelOpen, setPanelOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentSelect, setCurrentSelect] = useState(null);

  console.log(currentSelect);
  
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    if (!isCreating) return;

    const form = e.target;
    const formData = new FormData(form);

    //Example: inspect the data
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    await fetch(endpointCreate, {
      method: "POST",
      credentials: 'include',
      body: formData,
    }).then(res => res.json())
    .then(data => {
      form.reset();
      onReload();
      setIsCreating(false);
      alert(data.message);
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!currentSelect) return;

    const form = e.target;
    const formData = new FormData(form);
    formData.append('equipo_id', currentSelect.equipo_id);

    //Example: inspect the data
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    await fetch(endpointEdit + currentSelect.est_id, {
      method: "PATCH",
      credentials: 'include',
      body: formData,
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      onReload();
      setCurrentSelect(null);
    });
  };

  const handleSubmitDelete = async (user)=>{
    if (!confirm(`¿ESeguro de que eliminar a ${user.name}?`)) {
      return;
    }
    await fetch(endpointDelete + user.est_id, {
      method: "DELETE",
      credentials: 'include'
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      onReload();
    });
  }

  return (<>
    <div className={styles.FormEstudiantes}>
      <div>
        <table className={styles.minimalTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.length !== 0 && students.map((user, idx) => (
              <RowTable 
                key={idx}
                name={user.name}
                onEdit={()=> {
                  setCurrentSelect(user)
                  setPanelOpen(true)
                }}
                onDelete={(e)=> {
                  e.preventDefault();
                  handleSubmitDelete(user);
                }}
              />
            ))}
          </tbody>
        </table>

        <button
          className={styles.AddStudent}
          onClick={()=> {
            setIsCreating(true);
            setPanelOpen(true);
          }}
        >Agregar integrante</button>
      </div>

      {/* Panel Agregar */}
      <div
        className={
          `${styles.FormPanel} ${(panelOpen && isCreating) ? styles.isOpen : ""}`
        }
      >
        {isCreating && (
          <>
            <button 
              onClick={()=> {
                setPanelOpen(false);
                setCurrentSelect(null);
              }}
            >
              <IconBack color="var(--text-inverse)"/>
            </button>
            <AuxFormEdit 
              required={true}
              onSubmit={handleSubmitCreate}
              onCancel={()=> {
                setPanelOpen(false);
                setCurrentSelect(null);
              }}
            />
          </>
          )}
      </div>
      
      {/* Panel Edit */}
      <div
        className={
          `${styles.FormPanel} ${(panelOpen && currentSelect) ? styles.isOpen : ""}`
        }
      >
        {currentSelect && (
          <>
            <button 
              onClick={()=> {
                setPanelOpen(false);
                setCurrentSelect(null);
              }}
            >
              <IconBack color="var(--text-inverse)"/>
            </button>
            <AuxFormEdit 
              user={currentSelect}
              onSubmit={handleSubmitEdit}
              onCancel={()=> {
                setPanelOpen(false);
                setCurrentSelect(null);
              }}
            />
          </>
          )}
      </div>
    </div>
  </>);
}

export { FormEstudiantes };