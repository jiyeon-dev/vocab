import { FaStar } from "react-icons/fa6";
import styles from "./carousel.module.css";
import { useState } from "react";

export default function ItemCard({ item }) {
  const [rotate, setRotate] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // 카드 뒤집기
  const handleFlipCard = (event) => {
    event.preventDefault();
    if (event.target.tagName === "path") return;
    setRotate((prev) => !prev);
  };

  const handleFavorites = (event) => {
    event.stopPropagation();
    setFavorite((prev) => !prev); // TODO: localhost에 저장
  };

  const meanings = item.meanings.split(/[,.]/);

  return (
    <div
      className={`${styles.card} shadow-sm h-64 m-10 cursor-pointer`}
      style={{ transform: rotate ? "rotateX(180deg)" : "rotateX(0deg)" }}
      onDoubleClick={(event) => handleFlipCard(event)}
    >
      <div className={styles.cardFront}>
        <span className='text-xl xs:text-2xl sm:text-4xl font-semibold break-words'>
          {item.name}
        </span>
        <FaStar
          size={30}
          fill='#ffdd00'
          style={{ fill: favorite ? "#ffdd00" : "var(--shadow-color)" }}
          className='absolute m-4 top-0 right-0 cursor-pointer'
          onClick={handleFavorites}
        />
      </div>
      <div className={styles.cardBack}>
        <div className='text-xl sm:text-2xl	font-semibold break-all flex flex-col'>
          {meanings.map((meaning, index) => (
            <span key={index}>{meaning}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
