import { useEffect, useState } from "react";

import { Modal } from "../../Components/Modal";
import { InvitadosTable } from "./InvitadosTable";

import "./Invitados.css";

import imageCompression from "browser-image-compression";
import GLOBALS from "@/config/globals.js";
const API = GLOBALS.API;

const formInit = {
  nombre: "",
  desc: "",
};

function Invitados() {
  const [invitados, setInvitados] = useState([]);
  const [selectInvitado, setSelectInvitado] = useState(null);
  const [editInvitado, setEditInvitado] = useState(null);
  const [btnDisabled, setbtnDisabled] = useState(false);

  const [load, setLoad] = useState(true);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [formAdd, setFormAdd] = useState(formInit);
  const [formEdit, setFormEdit] = useState(formInit);

  const titulos = [
    { txt: "Nombre", key: "nombre", size: "auto" },
    { txt: "Descripción", key: "desc", size: "auto" },
    { txt: "Imagen", key: "img", size: "200px" },
    { txt: "Acciones", key: "actions", size: "150px" },
  ];

  const actions = [
    { callback: (item) => handleEditarClick(item), txt: "Editar", emoji: "✏️", color: "#c5da74" },
    { callback: (item) => handleBorrarClick(item), txt: "Borrar", emoji: "🗑️", color: "#ec8b8b" },
    { callback: (item) => handleUpOrderClick(item), txt: "Subir", emoji: "⬆️", color: "#292929" },
    { callback: (item) => handleDownOrderClick(item), txt: "Bajar", emoji: "⬇️", color: "#292929" },
  ];

  const handleCrear = async (e) => {
    e.preventDefault();

    if (!confirm(`Crear invitado "${formAdd.nombre}"?`)) {
      return;
    }

    const formData = new FormData();
    formData.append("nombre", formAdd.nombre);
    formData.append("desc", formAdd.desc);
    
    if (formAdd.img) {
      const compress = await imageCompression(formAdd.img, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        initialQuality: 0.75,
      });
      formData.append("img", compress);
    }

    try {
      const res = await fetch(API + "/invitado/crear", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setOpenModalAdd(false);
      setFormAdd(formInit);
    } catch (err) {
      alert("Error al crear el invitado");
    } finally {
      setLoad(true);
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();

    if (!confirm(`Editar invitado "${editInvitado.nombre}"?`)) {
      return;
    }

    const formData = new FormData();
    formData.append("nombre", formEdit.nombre);
    formData.append("desc", formEdit.desc);
    
    if (formEdit.img) {
      const compress = await imageCompression(formEdit.img, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        initialQuality: 0.75,
      });
      formData.append("img", compress);
    }

    try {
      const res = await fetch(`${API}/invitado/editar/${editInvitado.invitado_id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setOpenModalEdit(false);
      setEditInvitado(null);
      setFormEdit(formInit);
    } catch (err) {
      alert("Error al editar el invitado");
    } finally {
      setLoad(true);
    }
  };

  const handleBorrarSubmit = async (e) => {
    e.preventDefault();

    if (!confirm(`Borrar invitado "${selectInvitado.nombre}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API}/invitado/delete/${selectInvitado.invitado_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setOpenModalDelete(false);
      setSelectInvitado(null);
    } catch (err) {
      alert("Error al eliminar el invitado");
    } finally {
      setLoad(true);
    }
  };

  const handleEditarClick = (invitado) => {
    setEditInvitado({ ...invitado });
    setFormEdit({ ...formEdit, nombre: invitado.nombre, desc: invitado.desc});
    setOpenModalEdit(true);
  };

  const handleBorrarClick = (invitado) => {
    setSelectInvitado(invitado);
    setOpenModalDelete(true);
  };

  const handleUpOrderClick = async (invitado) => {
    setbtnDisabled(true);
    try {
      const res = await fetch(`${API}/invitado/set_index/${invitado.invitado_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_index: invitado.order_index + 1 }),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.message || data.data);
    } catch (e) {
      alert(e);
    } finally {
      setLoad(true);
    }
  };

  const handleDownOrderClick = async (invitado) => {
    setbtnDisabled(true);
    try {
      const res = await fetch(`${API}/invitado/set_index/${invitado.invitado_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_index: invitado.order_index - 1 }),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.message || data.data);
    } catch (e) {
      alert(e);
    } finally {
      setLoad(true);
    }
  };

  useEffect(() => {
    if (!load) return;

    fetch(API + "/invitado/get", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setInvitados(data.data || []);
        setLoad(false);
        setbtnDisabled(false);
      });
  }, [load]);

  return (
    <main>
      <h1>Invitados</h1>

      <div className="InvitadosContainer">
        <InvitadosTable
          titulos={titulos}
          data={invitados || []}
          actions={actions}
          onLoad={btnDisabled}
        />

        <button
          className="btn-add"
          onClick={() => setOpenModalAdd(true)}
        >
          Crear Invitado
        </button>
      </div>

      {openModalAdd && (
        <Modal>
          <form className="Form" onSubmit={handleCrear}>
            <h2>Crear Invitado</h2>

            <label>
              <h4>Nombre</h4>
              <input
                required
                type="text"
                placeholder="Nombre del invitado"
                value={formAdd.nombre}
                onChange={(e) =>
                  setFormAdd({ ...formAdd, nombre: e.target.value })
                }
              />
            </label>

            <label>
              <h4>Descripción</h4>
              <textarea
                required
                placeholder="Descripción del invitado"
                value={formAdd.desc}
                onChange={(e) =>
                  setFormAdd({ ...formAdd, desc: e.target.value })
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
            <h2>Editar Invitado</h2>

            <label>
              <h4>Nombre</h4>
              <input
                required
                type="text"
                placeholder="Nombre del invitado"
                value={formEdit.nombre}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, nombre: e.target.value })
                }
              />
            </label>

            <label>
              <h4>Descripción</h4>
              <textarea
                required
                placeholder="Descripción del invitado"
                value={formEdit.desc}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, desc: e.target.value })
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

            {editInvitado?.img && (
              <div className="current-image">
                <p>Imagen actual:</p>
                <img
                  src={API + editInvitado.img}
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
            <h2>Borrar Invitado</h2>

            <p>¿Borrar al invitado "{selectInvitado?.nombre}"?</p>

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

export { Invitados };
