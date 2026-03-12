import { useNavigate } from "react-router-dom";

import styles from "./styles.module.css";
import IconBack from "@/components/icons/react/IconBack";

function BtnReturn(){
  const navigate = useNavigate();
  return (
    <button 
      className={styles.BtnReturn}
      onClick={()=> navigate("/")}
    >
      <IconBack color='#fff'/>
    </button>
  );
}

export { BtnReturn };