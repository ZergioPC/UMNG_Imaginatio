import { useState } from "react";
import styles from "./styles.module.css";

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
      formData.append("img", imgFile);
    }

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
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
        <span>Imagen de Perfil del Equipo</span>

        {preview && (
          <img
            src={preview}
            alt="current-image"
            width="350"
            className={styles.imagePreview}
          />
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