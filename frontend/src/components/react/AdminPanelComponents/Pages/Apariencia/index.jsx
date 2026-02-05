import { useState, useEffect } from "react";

import "./Apariencia.css";
import imageCompression from "browser-image-compression";

const API = "/api";

function Apariencia(){
  const [imgPlaceholder, setImgPlaceholder] = useState(`${API}/uploads/users/idle.jpg`);
  // Fetch Placeholder
  const handlePostPlaceHolder = async e => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const imageFile = formData.get("img")
      if (imageFile && imageFile.size > 0) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          initialQuality: 0.75,
        });
        formData.set("img", compressedFile);
      }
    } catch (error) {
        console.log(error);
    }

    fetch(`${API}/utils/placeholder-img`, {
      method: 'POST',
      body: formData,
      credentials: "include"
    }).then(res => res.json())
    .then( data => {
      console.log(data);
      
    });
  }

  return (
    <main className="Apariencia">
      <h1>Apariencia</h1>

      <section>
        <h2>Apariencia de los posts</h2>
        
        <form>
          <h3>Header</h3>
          <p>proximamente...</p>
        </form>

        <form>
          <h3>Fondo</h3>
          <p>proximamente...</p>
        </form>

        <form>
          <h3>Marco</h3>
          <p>proximamente...</p>
        </form>

        <form onSubmit={handlePostPlaceHolder}>
          <h3>User Placeholder</h3>
          <p>Foto de perfil por defecto para los usuarios y equipos que no han puesto foto de perfil todavía</p>
          <picture>
            <img 
              src={imgPlaceholder} 
              alt="placeholder" 
            />
          </picture>
          <input 
            required
            type="file"
            name="img" 
            accept="image/*"
            onChange={(e)=> 
              setImgPlaceholder(URL.createObjectURL(e.target.files[0]))
            }
          /> 

          <button type="submit">Aceptar</button>
        </form>

      </section>

      <section>
        <h2>Banner</h2>
        <p>proximamente</p>
      </section>

      <section>
        <h2>Imagen de fondo</h2>
        <p>proximamente</p>
      </section>

      <section>
        <h2>Paleta de colores</h2>
        <p>proximamente</p>
      </section>
    </main>
  );
}

export { Apariencia };