import styles from "./styles.module.css";
import { useState, useEffect } from "react";

function Banner ({ images, autoPlayInterval = 6000, autoPlay = true }){
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval]);

  return (
    <div className={styles.slider}>
      <div
        className={styles.slides}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className={styles.slide} 
            style={{backgroundColor: image.bg}}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
            />
          </div>
        ))}
      </div>

      <button className={styles.prev} onClick={prevSlide}>
        ‹
      </button>
      <button className={styles.next} onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export  { Banner };