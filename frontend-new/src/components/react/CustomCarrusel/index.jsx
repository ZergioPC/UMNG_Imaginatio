import { useMemo } from "react";
import "./CustomCarrusel.css";

const images = [
  "/src/assets/lastEvents/I.png",
  "/src/assets/lastEvents/II.png",
  "/src/assets/lastEvents/III.png",
  "/src/assets/lastEvents/IV.png",
  "/src/assets/lastEvents/V.png",
  "/src/assets/lastEvents/VI.png",
  "/src/assets/lastEvents/VII.png",
  "/src/assets/lastEvents/X.jpg",
  "/src/assets/lastEvents/XI.jpg",
  "/src/assets/lastEvents/XII.jpg",
  "/src/assets/lastEvents/XIV.gif",
]

// CONFIG — add/remove rows here
const rowsConfig = [
  { direction: "left", speed: 80 },
  { direction: "right", speed: 90 },
  { direction: "left", speed: 85 },
  { direction: "right", speed: 95 },
  { direction: "left", speed: 88 },
];

function Row({ images, direction, speed }) {
  const shuffledImages = useMemo(() => shuffle([...images]), []);

  return (
    <div
      className={`carousel-row ${direction}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {[...shuffledImages, ...shuffledImages].map((src, i) => (
        <img key={i} src={src} alt="" />
      ))}
    </div>
  );
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function CustomCarrusel(){
  return (
    <div className="carousel-wrapper">
      {rowsConfig.map((row, index) => (
        <Row
          key={index}
          images={images}
          direction={row.direction}
          speed={row.speed}
        />
      ))}
    </div>
  );
}

export { CustomCarrusel };