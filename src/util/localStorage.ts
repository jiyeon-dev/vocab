// 키 생성
const generateKey = (categoryId: string, chapterId: string): string => {
  return `${categoryId}||${chapterId}`;
};

/**
 * 단어 저장
 * @param categoryId 카테고리 id
 * @param chapterId 챕터 id
 * @param value 단어
 */
const saveVocabulary = (
  categoryId: string,
  chapterId: string,
  value: string
): void => {
  const key: string = generateKey(categoryId, chapterId);

  try {
    // 저장된 값이 있는지 확인
    const currentValues = getVocabularyByKey(key);
    if (currentValues) {
      currentValues.push(value);
      localStorage.setItem(key, JSON.stringify(currentValues));
    } else {
      localStorage.setItem(key, JSON.stringify([value]));
    }
  } catch (error) {
    throw new Error("Error adding from localStorage");
  }
};

/**
 * 단어 삭제
 * @param categoryId 카테고리 id
 * @param chapterId 챕터 id
 * @param value 단어
 */
const deleteVocabulary = (
  categoryId: string,
  chapterId: string,
  value: string
): void => {
  const key: string = generateKey(categoryId, chapterId);

  try {
    const currentValues = getVocabularyByKey(key);
    if (currentValues) {
      const newValues = currentValues.filter((data) => data !== value);
      localStorage.setItem(key, JSON.stringify(newValues));
    }
  } catch (error) {
    throw new Error("Error deleting from localStorage");
  }
};

/**
 * 저장된 단어 조회
 * @param categoryId 카테고리 id
 * @param chapterId 챕터 id
 * @returns
 */
const getVocabulary = (
  categoryId: string,
  chapterId: string
): string[] | null => {
  const key: string = generateKey(categoryId, chapterId);
  const data: string | null = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  else return null;
};
/**
 * 저장된 단어 키로 조회
 * @param categoryId 카테고리 id
 * @param chapterId 챕터 id
 * @returns
 */
const getVocabularyByKey = (key: string): string[] | null => {
  const data: string | null = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  else return null;
};

export { saveVocabulary, deleteVocabulary, getVocabulary };
