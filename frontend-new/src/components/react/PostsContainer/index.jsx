import styles from "./styles.module.css";

import React from "react";
import { Post } from "../Post";

function PostsContainer(){
  return (
    <section className={styles.Container}>
      <Post onModal={()=> console.log("1")}/>
      <Post onModal={()=> console.log("2")}/>
      <Post onModal={()=> console.log("3")}/>
      <Post onModal={()=> console.log("4")}/>
      <Post onModal={()=> console.log("5")}/>
    </section>
  );
}

export { PostsContainer };