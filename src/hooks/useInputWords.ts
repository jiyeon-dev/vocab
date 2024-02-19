import { useState, useRef, RefObject } from "react";
import { toast } from "sonner";

export type WordType = { name: string; meanings: string };
export type InputWords = {
  words: WordType[];
  wordRef: RefObject<HTMLInputElement>;
  meaningRef: RefObject<HTMLInputElement>;
  addWord: () => void;
  deleteWord: (item: WordType) => void;
};

export default function useInputWords(
  defaultValue: WordType[] = []
): InputWords {
  const [words, setWords] = useState<WordType[]>(defaultValue);
  const wordRef = useRef<HTMLInputElement>(null);
  const meaningRef = useRef<HTMLInputElement>(null);

  const addWord = () => {
    const wordEl = wordRef.current as HTMLInputElement;
    const meaningEl = meaningRef.current as HTMLInputElement;
    if (!wordEl || !meaningEl) return;

    const name = wordEl.value;
    const meanings = meaningEl.value;

    if (!name) wordEl.classList.add("border-red-500");
    else wordEl.classList.remove("border-red-500");
    if (!meanings) meaningEl.classList.add("border-red-500");
    else meaningEl.classList.remove("border-red-500");
    if (!name || !meanings) return;

    // 이미 있는 단어인지 체크
    const isExist = words.some((item) => item.name === name);
    if (isExist) {
      toast?.error("이미 추가된 단어입니다.");
      return;
    }

    setWords((prev: WordType[]) => [...prev, { name, meanings }]);
    wordEl.value = "";
    meaningEl.value = "";
  };

  const deleteWord = (item: WordType) => {
    setWords(words.filter((x) => x.name !== item.name));
  };

  return {
    words,
    wordRef,
    meaningRef,
    addWord,
    deleteWord,
  };
}
