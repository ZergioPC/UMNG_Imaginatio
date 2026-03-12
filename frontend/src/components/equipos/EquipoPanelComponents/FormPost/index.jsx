import {useState} from "react";

import styles from "./styles.module.css";
import imageCompression from "browser-image-compression";

function RowTable({ id, title, likes, onDelete }){
  return (
    <tr>
      <td style={{"max-width":"20px"}}>{id}</td>
      <td style={{"max-width":"auto"}}>{title}</td>
      <td style={{"max-width":"40px"}}>{likes}</td>
      <td style={{"max-width":"40px"}}>
        <button 
          onClick={onDelete}
        >borrar</button>
      </td>
    </tr>
  );
}

const formDataInit = {
  title:"", description: "", image: null
}

function FormPost({ posts, endpointCreate, endpointDelete, onReload}){
  const [formData, setFormData] = useState(formDataInit)
  
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);    
    
    if(!confirm("Todo listo para publicar:" + form.title.value)){
      return;
    }

    try {
      const imageFile = formData.get("image")
      if (imageFile && imageFile.size > 0) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          initialQuality: 0.8,
        });
        formData.set("image", compressedFile);
      }
    } catch (error) {
       console.log(error);
    }
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
      setFormData(formDataInit);
      onReload();
      alert(data.message);
    });
  };

  const handlePostDelete = async (post) =>{
    if(!confirm(`¿Quiere borrar el post: ${post.title}?`)){
      return;
    }

    await fetch(endpointDelete + post.post_id, {
      method: "DELETE",
      credentials: 'include'
    }).then(res => res.json())
    .then(data => {
      alert(data.message);
      onReload();
    });
  };

  return (
    <div className={styles.FormPost}>
      {/* Crear post */}
      <div className={styles.FormPostCreate}>
        <h3>Crear un Post</h3>
        <form onSubmit={handleSubmitCreate}>
          <label>
            <span>Título</span>
            <input 
              required 
              type="text" 
              name="title"
              value={formData.title}
              maxLength={50}
              onChange={e => setFormData({
                ...formData,
                title : e.target.value
              })}
            />
          </label>
          <label>
            <span>Descripción</span>
            <textarea 
              required
              maxLength={250}
              name="description" 
              value={formData.description}
              onChange={e => setFormData({
                ...formData,
                description : e.target.value
              })}
            />
          </label>
          <label>
            <span>Imagen</span>
            <img 
              src={formData.image ? URL.createObjectURL(formData.image): ""} 
              alt="Imagen del Nuevo post" 
            />
            <input 
              required 
              type="file" 
              name="image" 
              accept="image/*"
              onChange={e => setFormData({
                ...formData,
                image: e.target.files[0],
              })}
            />
          </label>
          <button type="submit">Publicar</button>
        </form>
      </div>

      {/* Lista de Posts */}
      <div className={styles.FormPostTable}>
        <h3>Listado de Posts</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titulo</th>
              <th>Likes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.length !== 0 && posts.map((post,idx) =>
              <RowTable 
                key={idx}
                id={post.post_id}
                title={post.title}
                likes={post.likes}
                onDelete={(e)=> {
                  e.preventDefault();
                  handlePostDelete(post);
                }}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { FormPost };