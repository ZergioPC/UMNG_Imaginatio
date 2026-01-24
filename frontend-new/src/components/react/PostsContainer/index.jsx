import { useState, useEffect } from "react";

import { Post } from "../Post";
import { Modal } from "../Modal";

import styles from "./styles.module.css";

function PostsContainer(){
  // Loading and Errors
  const [loading, setLoading] = useState(true);

  // Paginator
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(99);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  
  const prevPage = ()=>{
    if (currentPage === 1) return;
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
    setMaxPages(5);
    setLoading(false);
  },[]);

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
        <Post onModal={()=> showModal()}/>
        <Post onModal={()=> showModal()}/>
        <Post onModal={()=> showModal()}/>
        <Post onModal={()=> showModal()}/>
        <Post onModal={()=> showModal()}/>
      </section>
      <section className={styles.Paginator}>
        <button 
          disabled={currentPage === 1 || loading}
          className={styles.pagBefore}
          onClick={prevPage}
        >B</button>
        <span>{currentPage}</span>
        <button 
          disabled={currentPage === maxPages || loading}
          className={styles.pagBefore}
          onClick={nextPage}
        >A</button>
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