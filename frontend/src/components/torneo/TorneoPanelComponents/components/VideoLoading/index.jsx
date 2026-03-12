import styles from "./styles.module.css";
import Loading_1080 from "../../../../../assets/mundialito/Loading_1080.mp4";

function VideoLoading(){
  return (
    <div className={styles.VideoLoading}>
      <video autoPlay muted loop>
        <source src={Loading_1080} type="video/mp4"/>
      </video>
    </div>
  );
}

export { VideoLoading };