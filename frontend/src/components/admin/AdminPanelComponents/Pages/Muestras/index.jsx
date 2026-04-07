import { useEffect, useState } from "react";

import { Modal } from "../../Components/Modal";
import { MuestrasTable } from "./MuestrasTable";

import "./Muestras.css";

import imageCompression from "browser-image-compression";
import GLOBALS from "@/config/globals.js";
const API = GLOBALS.API;

const formInit = {
  title: "",
  page: "#",
};

function Muestras() {
  const [muestras, setMuestras] = useState([]);
  const [selectMuestra, setSelectMuestra] = useState(null);
  const [editMuestra, setEditMuestra] = useState(null);

  const [load, setLoad] = useState(true);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [formAdd, setFormAdd] = useState(formInit);
  const [formEdit, setFormEdit] = useState(formInit);

  const titulos = [
    //{ txt: "ID", key: "muestra_id", size: "50px" },
    { txt: "Título", key: "title", size: "auto" },
    { txt: "URL", key: "page", size: "auto" },
    { txt: "Imagen", key: "img", size: "200px" },
    { txt: "Acciones", key: "actions", size: "150px" },
  ];

  const actions = [
    { callback: (item) => handleEditarClick(item), txt: "Editar", color: "#c5da74" },
    { callback: (item) => handleBorrarClick(item), txt: "Borrar", color: "#ec8b8b" },
  ];

  const handleCrear = async (e) => {
    e.preventDefault();

    if (!confirm(`Crear muestra "${formAdd.title}"?`)) {
      return;
    }

    const formData = new FormData();
    formData.append("title", formAdd.title);
    formData.append("page", formAdd.page);
    if (formAdd.img) {
      const compress =  await imageCompression(formAdd.img,{
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        initialQuality: 0.75,
      });
      formData.append("img", compress);
    }

    try {
      const res = await fetch(API + "/muestra/crear", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setOpenModalAdd(false);
      setFormAdd(formInit);
    } catch (err) {
      alert("Error al crear la muestra");
    } finally{
      setLoad(true);
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();

    if (!confirm(`Editar muestra "${editMuestra.title}"?`)) {
      return;
    }

    const formData = new FormData();
    formData.append("title", formEdit.title);
    formData.append("page", formEdit.page);
    if (formEdit.img) {
      const compress =  await imageCompression(formEdit.img,{
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        initialQuality: 0.75,
      });
      formData.append("img", compress);
    }

    try {
      const res = await fetch(`${API}/muestra/editar/${editMuestra.muestra_id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setOpenModalEdit(false);
      setEditMuestra(null);
      setFormEdit(formInit);
    } catch (err) {
      alert("Error al editar la muestra");
    } finally{
      setLoad(true);
    }
  };

  const handleBorrarSubmit = async (e) => {
    e.preventDefault();

    if (!confirm(`Borrar muestra "${selectMuestra.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API}/muestra/delete/${selectMuestra.muestra_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setOpenModalDelete(false);
      setSelectMuestra(null);
    } catch (err) {
      alert("Error al eliminar la muestra");
    } finally{
      setLoad(true);
    }
  };

  const handleEditarClick = (muestra) => {
    setEditMuestra({ ...muestra });
    setFormEdit({ ...formEdit, title: muestra.title, page: muestra.page });
    setOpenModalEdit(true);
  };

  const handleBorrarClick = (muestra) => {
    setSelectMuestra(muestra);
    setOpenModalDelete(true);
  };

  useEffect(() => {
    if (!load) return;

    fetch(API + "/muestra/get", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMuestras(data.data || []);
        setLoad(false);
      });
  }, [load]);

  return (
    <main>
      <h1>Muestras Académicas</h1>

      <div className="MuestrasContainer">
        <MuestrasTable
          titulos={titulos}
          data={muestras || []}
          actions={actions}
        />

        <button
          className="btn-add"
          onClick={() => setOpenModalAdd(true)}
        >
          Crear Muestra
        </button>
      </div>

      {openModalAdd && (
        <Modal>
          <form className="Form" onSubmit={handleCrear}>
            <h2>Crear Muestra</h2>

            <label>
              <h4>Título</h4>
              <input
                required
                type="text"
                placeholder="Título de la muestra"
                value={formAdd.title}
                onChange={(e) =>
                  setFormAdd({ ...formAdd, title: e.target.value })
                }
              />
            </label>

            <label>
              <h4>URL</h4>
              <input
                type="text"
                placeholder="www.example.com"
                value={formAdd.page}
                onChange={(e) =>
                  setFormAdd({ ...formAdd, page: e.target.value })
                }
              />
            </label>

            <label>
              <h4>Imagen</h4>
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormAdd({ ...formAdd, img: e.target.files[0] })
                }
              />
            </label>

            <div className="btn-container">
              <button type="submit">Crear</button>
              <button type="button" onClick={() => setOpenModalAdd(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {openModalEdit && (
        <Modal>
          <form className="Form" onSubmit={handleEditar}>
            <h2>Editar Muestra</h2>

            <label>
              <h4>Título</h4>
              <input
                required
                type="text"
                placeholder="Título de la muestra"
                value={formEdit.title}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, title: e.target.value })
                }
              />
            </label>

            <label>
              <h4>URL</h4>
              <input
                type="text"
                placeholder="www.example.com"
                value={formEdit.page}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, page: e.target.value })
                }
              />
            </label>

            <label>
              <h4>Imagen (nueva - opcional)</h4>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormEdit({ ...formEdit, img: e.target.files[0] })
                }
              />
              <small>Deja vacío para mantener la imagen actual</small>
            </label>

            {editMuestra?.img && (
              <div className="current-image">
                <p>Imagen actual:</p>
                <img
                  src={API + editMuestra.img}
                  alt="Imagen actual"
                  className="preview-img"
                />
              </div>
            )}

            <div className="btn-container">
              <button type="submit">Editar</button>
              <button type="button" onClick={() => setOpenModalEdit(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {openModalDelete && (
        <Modal>
          <form className="Form" onSubmit={handleBorrarSubmit}>
            <h2>Borrar Muestra</h2>

            <p>¿Borrar la muestra "{selectMuestra?.title}"?</p>

            <div className="btn-container">
              <button type="submit" style={{ backgroundColor: "#ff7474" }}>
                Borrar
              </button>
              <button type="button" onClick={() => setOpenModalDelete(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}

export { Muestras };