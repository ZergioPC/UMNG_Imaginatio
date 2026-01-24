import React from "react";
import styles from "./styles.module.css";

function Modal({children, onClose,}){
  return (
    <div className={styles.Modal}>
      <div>
        {children}
      </div>
      <button
        onClick={onClose}
      >Close</button>
    </div>
  );
}

export { Modal };