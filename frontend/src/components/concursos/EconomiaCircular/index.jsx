//event/get/2
import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import GLOBALS from "@/config/globals.js";
import styles from "./styles.module.css"

import { BtnAviso } from "../../buttons/BtnAviso";

const API = GLOBALS.API;

function EconomiaCircular(){
  const [content, setContent] = useState(null);

  useEffect(()=>{
    fetch(API + "/event/get/2")
      .then(res => res.json())
      .then(data => {
        setContent(data.data);
      });
  },[]);

  return <>
    <div className={styles.MdContainer}>
      <h2 className={styles.Titulo}>{content?.name ?? "Cargando..."}</h2>
      <ReactMarkdown>{content?.desc ?? ""}</ReactMarkdown>
    </div>
    <div className={styles.btnContainer}>
      <BtnAviso>
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSdzgMTGiJ2bcVIW-KW650esFaVM09u3aQP2jwmAJXJbFbk-2Q/viewform?usp=dialog" 
          target="_blank"
          style={{"fontSize":"2.5em"}}
        >Inscribete!</a>
      </BtnAviso>
    </div>
  </>
}

export { EconomiaCircular };