import { QueryClient } from "@tanstack/react-query";
import { db } from "@/util/firebase";
import {
  collection,
  orderBy,
  query,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";

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
