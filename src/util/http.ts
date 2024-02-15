import { QueryClient } from "@tanstack/react-query";
import { db } from "@/util/firebase";
import {
  collection,
  orderBy,
  query,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";
import { Chapter } from "@/types";

export const queryClient = new QueryClient();

/**
 * 카테고리 리스트 조회
 * @param pageParam
 * @returns
 */
export const getCategories = async (pageParam) => {
  const q = !pageParam
    ? query(collection(db, "category"), orderBy("createDate", "desc"), limit(6))
    : query(
        collection(db, "category"),
        orderBy("createDate", "desc"),
        startAfter(pageParam),
        limit(6)
      );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

/**
 * 카테고리에 속한 챕터 리스트 조회
 * @param param0 categoryId
 * @returns
 */
export const getChapters = async ({ categoryId }): Promise<Chapter[]> => {
  const q = query(
    collection(db, "chapter"),
    where("categoryId", "==", categoryId)
  );
  const querySnapshot = await getDocs(q);
  const data: Chapter[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 데이터 오름차순 정렬
  data.sort((a, b) => {
    return a.order - b.order;
  });

  return data;
};

/**
 * 챕터에 속한 단어 리스트 조회
 * @param param0 chapterId
 * @returns
 */
export const getVocabularies = async ({ chapterId }): Promise<Vocabulary[]> => {
  const q = query(
    collection(db, "vocabulary"),
    where("chapterId", "==", chapterId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
