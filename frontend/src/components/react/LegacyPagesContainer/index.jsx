import { use, useState } from "react";
import IconBack from "../Icons/IconBack";
import styles from "./styles.module.css";

function ItemPage({ image, text, version, onClick }){
  return (
    <article 
      className={styles.Card}
      onClick={onClick}
    >
      <div className={styles.ImageWrapper} id={version}>
        <img
          src={image}
          alt={"Poster del imaginatio " + version}
        />
      </div>

      <div className={styles.content}>
        <span className={styles.version}>Edición {version}</span>
        <p>{text}</p>
      </div>
    </article>
  );
}

function ModalIframe({ url, isOpen, onClose }){
  return (
    <div 
      className={
        `${styles.ModalIframe} ${isOpen ? styles.open : ""}`
      }
    >
      <button onClick={onClose}>
        <IconBack color="#000"/>
      </button>
      {isOpen && <iframe src={url} frameborder="0"/>}
    </div>
  );
}

function LegacyPagesContainer({ data }){
  const [openModal, setOpenModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("#");
  
  return (
    <>
      <section className={styles.Container}>
        {data && data.map(event =>
          <ItemPage
            image={event.image}
            text={event.text} 
            version={event.version}
            onClick={()=> {
              console.log(event.url);
              setCurrentUrl(event.url);
              setOpenModal(true);
            }}
          />
        )}
      </section>

      <ModalIframe 
        url={currentUrl}
        isOpen={openModal}
        onClose={()=> {
          setOpenModal(false);
          setCurrentUrl("none");
        }}
      />
    </>
  );
}

export { LegacyPagesContainer };