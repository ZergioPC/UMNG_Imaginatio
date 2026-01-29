import { useState, useEffect } from "react";

import { Post } from "../Post";
import { Modal } from "../Modal";

import styles from "./styles.module.css";
import ArrowLeft from "../Icons/ArrowLeft";

const API = "http://localhost:8000"

function PostsContainer({ endpoint }){
  // Loading and Errors
  const [loading, setLoading] = useState(true);

  // Paginator
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPages, setMaxPages] = useState(99);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  // Posts List
  const [posts, setPosts] = useState([]);

  const prevPage = ()=>{
    if (currentPage === 0) return;
    setCurrentPage(prev => prev - 1);
  }

  const nextPage = ()=>{
    if (currentPage === maxPages) return;
    setCurrentPage(prev => prev + 1);
  }

  const showModal = (data)=> {
    setOpenModal(true);
    setDataModal(data);
  }

  // Fetcg data
  useEffect(()=>{
    fetch(API + endpoint + (currentPage))
    .then(res => res.json())
    .then(data => {
      setPosts(data.data);
      setMaxPages(data.pages);
      setLoading(false);
    })
  },[]);

  // MODAL
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openModal]);


  return (
    <>
      <section 
        className={styles.Container} 
      >
        {posts.length !== 0 ? (
          posts.map(pub =>
            <Post 
              data={pub}
              onModal={()=> showModal()}
            />
          )
        ) : (
          <p>No hay más publicaciones</p>
        )}
      </section>
      <section className={styles.Paginator}>
        <button 
          disabled={currentPage === 0 || loading}
          className={styles.pagBefore}
          onClick={prevPage}
        >
          <ArrowLeft color="var(--interactive-default)"/>
        </button>
        <span>{currentPage + 1}</span>
        <button 
          disabled={currentPage === maxPages -1 || loading}
          className={styles.pagBefore}
          onClick={nextPage}
        >
          <ArrowLeft color="var(--interactive-default)"/>
        </button>
      </section>

      {openModal && (
        <Modal
          onClose={()=> setOpenModal(false)}
        >
          <div className={styles.ModalContent}>
            <h2>{dataModal?.title ?? "Titulo"}</h2>
            <picture>
              <img 
                src={dataModal?.img ?? ""} 
                alt={`Publicación ${dataModal?.id} en Grande`}
              />
            </picture>
            <p>{dataModal?.desc ?? "Descripcion"}</p>
          </div>
        </Modal>
      )}
    </>
  );
}

export { PostsContainer };