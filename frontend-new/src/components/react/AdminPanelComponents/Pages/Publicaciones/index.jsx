import { useState, useEffect } from "react";

import { Table } from "../../Components/Table";

import ArrowLeft from "../../../Icons/ArrowLeft";

import "./Publicaciones.css";

const API = "http://localhost:8000";

function Publicaciones(){
  const [maxPage, setMaxPage] = useState(99999);
  const [currentPage, setCurrentPage] = useState(0);

  const [posts, setPosts] = useState([]);
  const [load, setLoad] = useState(true);

  const titulos = [
    { txt: "ID", key: "post_id", size: "30px" },
    { txt: "Titulo", key: "title", size: "auto" },
    { txt: "Autor", key: "equipo_name", size: "auto" },
    { txt: "Likes", key: "likes", size: "100px" },
    { txt: "Acciones", key: "actions", size: "100px" }
  ];

  const actions = [
    {callback: (item)=> handlePostDelete(item), txt:"Borrar", color:"#ec8b8b"},
  ];

  const handlePostDelete = post => {
    if (!confirm(`Borrar el post: ${post.title}`)) return;

    fetch(`${API}/post/delete-by-admin/${post.post_id}`, {
        method: 'DELETE',
        credentials: "include"
    }).then(res => res.json())
    .then(data => {
      alert(data.message || 'Post eliminado con éxito.');
      console.log(data);
      setLoad(true);
    });
  }

  // Fetch Posts
  useEffect(()=>{
    if (!load) return;

    fetch(`${API}/post/pages/${currentPage}`, {
      credentials: "include" 
    }).then(res => res.json())
    .then(data => {
      console.log(data.message);
      setPosts(data.data);
      setMaxPage(data.pages);
      setLoad(false);
    });
  },[currentPage, load]);
  
  return (
    <main>
      <h1>Publicaciones</h1>

      <div className="Controles">
        <label>
          <span>Filtrar por Equipo</span>
          <select>
            <option value="none">proximamente ...</option>
          </select>
        </label>

        <label className="paginator">
          <span>Página</span>
          <button 
            disabled={currentPage === 0}
            onClick={()=> {
              if (currentPage === 0) return;
              setCurrentPage(prev => prev-1);
            }}
          >
            <ArrowLeft color="#000"/>
          </button>
          <span>
            <strong>
              {currentPage + 1}
            </strong>
          </span>
          <button 
            disabled={currentPage + 1 === maxPage}
            onClick={()=> {
              if (currentPage + 1 === maxPage) return;
              setCurrentPage(prev => prev-1);
            }}
          >
            <ArrowLeft color="#000"/>
          </button>
        </label>
      </div>

      <Table 
        data={posts}
        titulos={titulos}
        actions={actions}
      />
    </main>
  );
}

export { Publicaciones };