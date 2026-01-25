import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const PLACEHOLDER = {
  post_id: -1,
  title: "str",
  desc: "str",
  img: "https://i.pinimg.com/736x/c9/31/bb/c931bb20240ef2fd73d670ffe5ed3b51.jpg",
  equipo_id: -1,
  likes: 777,
  equipo_name: "sample team name",
  equipo_img: "https://i.scdn.co/image/ab67656300005f1fffefae0e11e0686f14c76a9a",
}

function Post({ onModal, data = PLACEHOLDER}){
  const [liked, setLiked] = useState(false);

  return (
    <article className={styles.Post}>
      <div className={styles.Post_marco} onClick={onModal}></div>
      <header>
        <a href="#">
          <img src={data.equipo_img} alt={"Foto de perfil del equipo " + data.equipo_id} />
        </a>
        <span>{data.equipo_name}</span>
      </header>
      <main>
        <picture>
          <img src={data.img} alt={"Publicacion del equipo " + data.equipo_id} />
        </picture>
      </main>
      <footer>
        <label>
          <input
            type="checkbox"
            onChange={()=> setLiked(prev => !prev)}
            value={liked}
          />
          <span>❤️ {liked ? data.likes + 1 : data.likes}</span>
        </label>
      </footer>
    </article>
  );
}

export { Post };