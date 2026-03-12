import styles from "./styles.module.css";

function Modal({children}){
  return (<>
    <div className={styles.bg}/>
    <div className={styles.modal}>
      <article>
        {children}
      </article>
    </div>
  </>)
}

export { Modal };