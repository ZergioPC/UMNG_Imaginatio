import { useState, useEffect } from "react";

import "./Mundialito.css";
import imageCompression from "browser-image-compression";

import GLOBALS from "../../../../../../public/js/globals.js";

const API = GLOBALS.API;

function Mundialito(){
  // Fetch Placeholder
  // const handlePostPlaceHolder = async e => {
  //   e.preventDefault();

  //   const form = e.target;
  //   const formData = new FormData(form);

  //   try {
  //     const imageFile = formData.get("img")
  //     if (imageFile && imageFile.size > 0) {
  //       const compressedFile = await imageCompression(imageFile, {
  //         maxSizeMB: 0.8,
  //         maxWidthOrHeight: 800,
  //         useWebWorker: true,
  //         initialQuality: 0.75,
  //       });
  //       formData.set("img", compressedFile);
  //     }
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  return (
    <main className="Mundialito">
      <h1>Mundialito SetUp</h1>

      <section>
        <h2>Crear Equipos</h2>
      </section>

      <section>
        <h2>Crear Partidos</h2>
      </section>

      <section>
        <h2>Actualizar Marcador</h2>
      </section>

      <section>
        <h2>Crear Profesores</h2>
      </section>
    </main>
  );
}

export { Mundialito };