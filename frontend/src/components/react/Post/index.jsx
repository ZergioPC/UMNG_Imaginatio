import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const PLACEHOLDER = {
  post_id: -1,
  title: "str",
  desc: "str",
  img: "placeholder",
  equipo_id: -1,
  likes: 777,
  equipo_name: "sample team name",
  equipo_img: "placeholder",
}

const API = "/api";

function Post({ onModal, data = PLACEHOLDER}){
  const [liked, setLiked] = useState(false);

  //console.log(data);

  return (
    <article className={styles.Post}>
      <div className={styles.Post_marco} onClick={onModal}></div>
      <header>
        <a href={"/equipos?id=" + data.equipo_id}>
          <img 
            src={API + data.equipo_img} 
            alt={"Foto de perfil del equipo " + data.equipo_id} 
          />
        </a>
        <span>{data.equipo_name}</span>
      </header>
      <main>
        <picture>
          <img 
            src={API + data.img} 
            alt={"Publicacion del equipo " + data.equipo_id} 
          />
        </picture>
      </main>
      <footer>
        <label>
          <input
            type="checkbox"
            value={liked}
            onChange={()=> {
              setLiked(true)
              if (!liked) fetch(API + "/post/like/" + data.post_id, {method: 'PATCH'})
            }}
          />
          <span>❤️ {liked ? data.likes + 1 : data.likes}</span>
        </label>
      </footer>
    </article>
  );
}

export { Post };