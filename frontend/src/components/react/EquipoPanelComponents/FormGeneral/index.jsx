import { useState } from "react";
import styles from "./styles.module.css";
import imageCompression from "browser-image-compression";

function FormGeneral({ name, description, image, endpoint, onReload }) {
  const [publicName, setPublicName] = useState(name);
  const [desc, setDesc] = useState(description);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("publicName", publicName);
    formData.append("desc", desc);
    if (imgFile) {
      const compress =  await imageCompression(imgFile,{
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: 0.75,
      });
      formData.append("img", compress);
    }

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }
      onReload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        <span>Nombre del equipo</span>
        <input
          className={styles.input}
          type="text"
          value={publicName}
          onChange={(e) => setPublicName(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        <span>Descripcion</span>
        <textarea
          className={styles.textarea}
          rows="6"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        <span>Imagen de Perfil del Equipo <i>(Relación 1:1)</i></span>

        {preview && (
          <picture className={styles.imagePreview}>
            <img
              src={preview}
              alt="current-image"
            />
          </picture>
        )}

        <input
          className={styles.fileInput}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      <button className={styles.button} type="submit">
        Guardar Cambios del Equipo
      </button>
    </form>
  );
}

export { FormGeneral };