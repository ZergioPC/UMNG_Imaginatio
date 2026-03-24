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
    <h2 className={styles.Titulo}>{content?.name ?? "Name"}</h2>
    <div className={styles.MdContainer}>
      <ReactMarkdown>{content?.desc ?? "Desc"}</ReactMarkdown>
    </div>
    <div className={styles.btnContainer}>
      <BtnAviso>
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSddYMT0aJqDtr8Vfs_Pb5nSvArX8_26pErVpXUmEZC_NjYKiw/viewform" 
          target="_blank"
        >Inscribete!</a>
      </BtnAviso>
    </div>
  </>
}

export { EconomiaCircular };