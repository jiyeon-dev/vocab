import { FaStar } from "react-icons/fa6";
import styles from "./carousel.module.css";
import { useState } from "react";
import {
  deleteVocabulary,
  getVocabulary,
  saveVocabulary,
} from "@/util/localStorage";
import { useParams } from "react-router-dom";

export default function ItemCard({ item }) {
  const { categoryId, chapterId } = useParams();
  const [rotate, setRotate] = useState(false);
  // 저장된 단어인지 체크
  const favoriteList = getVocabulary(categoryId, chapterId);
  const isFavorite =
    typeof favoriteList === "object" ? favoriteList?.includes(item.id) : false;
  const [favorite, setFavorite] = useState(isFavorite);

  // 카드 뒤집기
  const handleFlipCard = (event) => {
    event.preventDefault();
    if (event.target.tagName === "path") return;
    setRotate((prev) => !prev);
  };

  const handleFavorites = (event) => {
    event.stopPropagation();
    setFavorite((prev) => {
      if (prev) {
        deleteVocabulary(categoryId, chapterId, item.id);
      } else {
        saveVocabulary(categoryId, chapterId, item.id);
      }
      return !prev;
    });
  };

  // 단어 뜻 줄바꿈
  const meanings = item.meanings.split(/[,.]/);

  return (
    <div
      className={`${styles.card} shadow-sm h-64 m-5 cursor-pointer`}
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
