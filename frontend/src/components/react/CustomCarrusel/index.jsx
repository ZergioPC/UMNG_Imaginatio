import { useMemo } from "react";
import "./CustomCarrusel.css";

const images = [
  "/lastEvents/I.png",
  "/lastEvents/II.png",
  "/lastEvents/III.png",
  "/lastEvents/IV.png",
  "/lastEvents/V.png",
  "/lastEvents/VI.png",
  "/lastEvents/VII.png",
  "/lastEvents/VIII.jpg",
  "/lastEvents/IX.jpg",
  "/lastEvents/X.jpg",
  "/lastEvents/XI.jpg",
  "/lastEvents/XII.jpg",
  "/lastEvents/XIV.gif",
  "/lastEvents/XVI.png",
  "/lastEvents/XVII.jpg"
]

// CONFIG — add/remove rows here
const rowsConfig = [
  { direction: "left", speed: 70 },
  { direction: "right", speed: 80 },
  { direction: "left", speed: 75 },
  { direction: "right", speed: 85 },
  { direction: "left", speed: 78 },
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