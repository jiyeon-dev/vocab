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
  deleteDoc,
  doc,
  getDoc,
  DocumentData,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { Chapter, Vocabulary } from "@/types";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
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

/**
 * 카테고리 단건 조회
 * @param id 카테고리 아이디
 * @returns
 */
export const getCategory = async ({
  categoryId,
}: {
  categoryId: string;
}): Promise<DocumentData> => {
  if (!categoryId) throw new Error("categoryId(이)가 없습니다.");
  const snapshot = await getDoc(doc(db, "category", categoryId));
  const img = await getMetadata(
    ref(
      storage,
      "https://firebasestorage.googleapis.com/v0/b/react-voca-455e7.appspot.com/o/9788965421030.jpg?alt=media&token=41562718-59fc-4111-a2c3-fdfb365a5eba"
    )
  );
  if (snapshot.exists()) {
    return {
      ...snapshot.data(),
      metadata: img,
    };
  } else {
    throw new Error("카테고리를 찾을 수 없습니다.");
  }
};

/**
 * 카테고리 수정
 * @param data 데이터
 * @param categoryId 카테고리 아이디
 * @returns
 */
export const updateCategory = async (
  categoryId: string,
  data: {
    [k: string]: FormDataEntryValue;
  }
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, "category", categoryId), {
      ...data,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
  return true;
};

/**
 * 카테고리 삭제
 * @param id 카테고리 아이디
 * @returns
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "category", id));
    return true;
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
};

/**
 * 챕터 생성
 * @param data
 * @returns
 */
export const createChapter = async (data: {
  [k: string]: FormDataEntryValue;
}): Promise<string> => {
  // 같은 이름 존재 여부 확인
  const q = query(
    collection(db, "chapter"),
    where("name", "==", data.name),
    where("categoryId", "==", data.categoryId)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    toast.error("동일한 이름의 챕터가 존재합니다.");
    return "";
  }

  // 마지막 order 번호 조회
  const chapters = await getChapters({ categoryId: data.categoryId as string });
  const order =
    chapters.length === 0 ? 1 : chapters[chapters.length - 1].order + 1;

  try {
    // 챕터 추가
    const chapterRef = await addDoc(collection(db, "chapter"), {
      categoryId: data.categoryId,
      name: data.name,
      order: order,
      timestamp: serverTimestamp(),
    });
    return chapterRef.id;
  } catch (error) {
    toast.error((error as Error).message);
    return "";
  }
};

/**
 * 보카 추가
 * @param chapterId 챕터 아이디
 * @param data 데이터 리스트
 * @returns
 */
export const updateVocabulary = async (
  chapterId: string,
  data: object[]
): Promise<boolean> => {
  try {
    const batch = writeBatch(db);

    // 삭제
    const q = query(
      collection(db, "vocabulary"),
      where("chapterId", "==", chapterId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((item) => {
      batch.delete(doc(db, "vocabulary", item.id));
    });

    // 추가
    data.map((item) => {
      const ref = doc(collection(db, "vocabulary")); // random id 생성되기 떄문에 매번 생성해줘야함.
      batch.set(ref, {
        chapterId: chapterId,
        ...item,
        timestamp: serverTimestamp(),
      });
    });

    await batch.commit();
    return true;
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
};

/**
 * 챕터 단건 조회
 * @param chapterId 챕터 아이디
 * @returns
 */
export const getChapter = async ({
  chapterId,
}: {
  chapterId: string;
}): Promise<DocumentData> => {
  if (!chapterId) throw new Error("chapterId(이)가 없습니다.");
  const snapshot = await getDoc(doc(db, "chapter", chapterId));
  const vocabulary = await getVocabularies({ chapterId });
  console.log(chapterId);
  console.log(snapshot);
  if (snapshot.exists()) {
    return {
      ...snapshot.data(),
      vocabulary,
    };
  } else {
    throw new Error("챕터를 찾을 수 없습니다.");
  }
};

/**
 * 챕터 삭제
 * @param id 챕터 아이디
 * @returns
 */
export const deleteChapter = async (id: string): Promise<boolean> => {
  try {
    const batch = writeBatch(db);
    console.log("id = ", id);

    // 챕터 삭제
    batch.delete(doc(db, "chapter", id));

    // 보카 삭제
    const vocabulary = await getVocabularies({ chapterId: id });
    vocabulary.map((item) => {
      batch.delete(doc(db, "vocabulary", item.id));
    });

    await batch.commit();
    return true;
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
};

/**
 * 챕터 수정
 * @param chapterId 챕터 아이디
 * @param data 챕터 정보
 * @param vocabulary 챕터에 속할 단어 리스트
 * @returns
 */
export const updateChapter = async (
  chapterId: string,
  data: {
    [k: string]: FormDataEntryValue;
  },
  vocabulary: object[]
): Promise<boolean> => {
  try {
    const batch = writeBatch(db);

    // 챕터 수정
    const ref = doc(db, "chapter", chapterId);
    batch.update(ref, { name: data.name });

    // vocabulary 삭제
    const q = query(
      collection(db, "vocabulary"),
      where("chapterId", "==", chapterId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((item) => {
      batch.delete(doc(db, "vocabulary", item.id));
    });

    // vocabulary 추가
    vocabulary.map((item) => {
      const ref = doc(collection(db, "vocabulary")); // random id 생성되기 떄문에 매번 생성해줘야함.
      batch.set(ref, {
        chapterId: chapterId,
        ...item,
        timestamp: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
  return true;
};
