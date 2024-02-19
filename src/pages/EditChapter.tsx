import {
  Form,
  Link,
  useNavigation,
  useSearchParams,
  redirect,
  Await,
  useRouteLoaderData,
  defer,
  json,
} from "react-router-dom";
import { FormItem, Input } from "@/components/ui/formItem";
import InputWordList from "@/components/InputWordList";
import { Button } from "@/components/ui/button";
import useInputWords from "@/hooks/useInputWords";
import { toast } from "sonner";
import useChapter from "@/hooks/useChapter";
import Loading from "@/components/Loader";
import {
  deleteChapter,
  getChapter,
  queryClient,
  updateChapter,
} from "@/util/http";
import { Suspense, useEffect } from "react";
import { DocumentData } from "firebase/firestore";

export default function EditChapter() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapterId") as string;
  const { words, setWords, wordRef, meaningRef, addWord, deleteWord } =
    useInputWords();
  const { handleUpdate, handleDelete } = useChapter(words);

  const { chapter } = useRouteLoaderData("chapter-detail") as DocumentData;
  useEffect(() => {
    setWords(chapter.vocabulary);
  }, []);

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={chapter}>
          {(data) => {
            return (
              <Form method='post' onSubmit={handleUpdate}>
                <Input
                  type='hidden'
                  name='categoryId'
                  value={data.categoryId}
                />
                <Input type='hidden' name='chapterId' value={chapterId} />
                <FormItem label='이름'>
                  <Input
                    type='text'
                    name='name'
                    placeholder='chapter'
                    maxLength={10}
                    defaultValue={data.name}
                    required
                  />
                </FormItem>
                <hr />
                <InputWordList
                  words={words}
                  wordRef={wordRef}
                  meaningRef={meaningRef}
                  addWord={addWord}
                  deleteWord={deleteWord}
                />

                <div className='flex justify-center space-x-4 mt-2'>
                  <Link to={`..?categoryId=${data.categoryId}`}>
                    <Button variant='outline' disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    variant='destructive'
                    disabled={isSubmitting}
                    onClick={(event) => handleDelete(event, data.categoryId)}
                  >
                    {isSubmitting ? "Submitting..." : "Delete"}
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Save"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Await>
      </Suspense>

      {isSubmitting && <Loading />}
    </>
  );
}

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const chapterId = url.searchParams.get("chapterId") || "";
  if (!chapterId)
    throw json({ message: "챕터 아이디를 찾을 수 없습니다." }, { status: 500 });

  return defer({
    chapter: await getChapter({ chapterId }),
  });
};

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response | null> => {
  const url = new URL(request.url);
  const chapterId = url.searchParams.get("chapterId") || "";

  const formData = await request.formData();
  const data = await Object.fromEntries(formData);
  const categoryId = data.categoryId;

  let message = "";

  if (request.method === "DELETE") {
    const response = await deleteChapter(chapterId);
    if (!response) return null;
    message = "삭제되었습니다.";
  } else if (request.method === "PUT") {
    const result = await updateChapter(
      chapterId,
      data,
      JSON.parse(data.vocabulary as string)
    );
    if (!result) return null;
    message = "수정되었습니다.";
  }

  // 캐시 삭제
  await queryClient.invalidateQueries({
    queryKey: ["chapter"],
  });

  toast.success(message);

  return redirect(`/chapter?categoryId=${categoryId}`);
};
