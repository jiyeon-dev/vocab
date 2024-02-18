import { QueryClient } from "@tanstack/react-query";
import { db, storage } from "@/util/firebase";
import {
  collection,
  orderBy,
  query,
  limit,
  startAfter,
  getDocs,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Chapter, Vocabulary } from "@/types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "sonner";

export const queryClient = new QueryClient();

/**
 * 카테고리 리스트 조회
 * @param pageParam
 * @returns
 */
export const getCategories = async (pageParam: object | null) => {
  const q = !pageParam
    ? query(collection(db, "category"), orderBy("timestamp", "desc"), limit(6))
    : query(
        collection(db, "category"),
        orderBy("timestamp", "desc"),
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
export const getChapters = async ({
  categoryId,
}: {
  categoryId: string;
}): Promise<Chapter[]> => {
  const q = query(
    collection(db, "chapter"),
    where("categoryId", "==", categoryId)
  );
  const querySnapshot = await getDocs(q);
  const data: Chapter[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    order: doc.data().oder,
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
export const getVocabularies = async ({
  chapterId,
}: {
  chapterId: string;
}): Promise<Vocabulary[]> => {
  const q = query(
    collection(db, "vocabulary"),
    where("chapterId", "==", chapterId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    meanings: doc.data().meanings,
    ...doc.data(),
  }));
};

/**
 * 이미지 업로드
 * @param {File} image 이미지 파일
 * @returns {string} 성공 시 imageURL 반환 / 실패시 빈 문자열 반환
 */
export const uploadImage = async (image: File): Promise<string> => {
  if (image) {
    try {
      const storageRef = ref(storage, image.name);
      // 이미지 업로드
      const snapshot = await uploadBytesResumable(storageRef, image, {
        contentType: image.type,
      });
      // 다운로드 URL 조회
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return "";
    }
  }
  return "";
};

/**
 * 이미지 삭제
 * @param imagePath 이미지 경로
 * @returns {boolean} 성공 여부
 */
export const deleteImage = async (imagePath: string): Promise<boolean> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
};

/**
 * 카테고리 추가
 * @param data
 * @returns {boolean} 성공 여부
 */
export const createCategory = async (data: {
  [k: string]: FormDataEntryValue;
}): Promise<boolean> => {
  // 같은 이름 존재 여부 확인
  const q = query(collection(db, "category"), where("name", "==", data.name));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    toast.error("동일한 이름의 카테고리가 존재합니다.");
    return false;
  }

  // 추가
  try {
    await addDoc(collection(db, "category"), {
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
  return true;
};
