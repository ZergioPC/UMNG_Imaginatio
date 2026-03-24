import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import GLOBALS from "@/config/globals.js";
import styles from "./styles.module.css"

const API = GLOBALS.API;

function FeriaProyectos(){
  const [content, setContent] = useState(null);

  useEffect(()=>{
    fetch(API + "/event/get/1")
      .then(res => res.json())
      .then(data => {
        setContent(data.data);
      });
  },[]);

  return <>
    <div className={styles.MdContainer}>
      <h2 className={styles.Titulo}>{content?.name ?? "Name"}</h2>
      <ReactMarkdown>{content?.desc ?? "Desc"}</ReactMarkdown>
    </div>
  </>
}

export { FeriaProyectos };