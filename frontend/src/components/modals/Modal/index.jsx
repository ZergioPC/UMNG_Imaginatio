import React from "react";
import IconClose from "@/components/icons/react/IconClose";


import styles from "./styles.module.css";

function Modal({children, onClose,}){
  return (
    <div className={styles.Modal}>
      <div>
        {children}
      </div>
      <button
        onClick={onClose}
      >
        <IconClose color="var(--brand-primary)"/>
      </button>
    </div>
  );
}

export { Modal };