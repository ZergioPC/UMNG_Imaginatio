import styles from "./styles.module.css";

function BtnAviso({ children }){
  return (
    <div className={styles.BtnAviso}>
      {children}
    </div>
  )
}

export { BtnAviso }