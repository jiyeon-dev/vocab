import {
  Form,
  Link,
  useNavigation,
  useSubmit,
  useSearchParams,
  redirect,
} from "react-router-dom";
import { FormItem, Input } from "@/components/ui/formItem";
import InputWordList from "@/components/InputWordList";
import { Button } from "@/components/ui/button";
import useInputWords from "@/hooks/useInputWords";
import { toast } from "sonner";
import { createChapter, queryClient, updateVocabulary } from "@/util/http";
import Loading from "@/components/Loader";

export default function NewChapter() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { words, wordRef, meaningRef, addWord, deleteWord } = useInputWords();
  const submit = useSubmit();

  if (!categoryId) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-center'>categoryId를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (words.length === 0) {
      toast.error("단어를 입력해 주세요.");
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("vocabulary", JSON.stringify(words));
    formData.append("categoryId", categoryId);
    submit(formData, { method: "POST" });
  };

  return (
    <>
      <Form method='post' onSubmit={handleSubmit}>
        <FormItem label='이름'>
          <Input
            type='text'
            name='name'
            placeholder='chapter'
            maxLength={10}
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
          <Link to='..'>
            <Button variant='outline' disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </Button>
        </div>
      </Form>
      {isSubmitting && <Loading />}
    </>
  );
}

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response | null> => {
  const formData = await request.formData();
  const data = await Object.fromEntries(formData);
  const categoryId = data.categoryId;

  // add chapter
  const chapterId = await createChapter(data);
  if (!chapterId) return null;

  const dataSaveResult = await updateVocabulary(
    chapterId,
    JSON.parse(data.vocabulary as string)
  );
  if (!dataSaveResult) return null;

  // 캐시 삭제
  await queryClient.invalidateQueries({
    queryKey: ["chapter"],
  });

  toast.success("생성되었습니다.");
  return redirect(`/chapter?categoryId=${categoryId}`);
};
