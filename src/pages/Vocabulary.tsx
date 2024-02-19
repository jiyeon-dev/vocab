import { getVocabularies } from "@/util/http";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "@/components/Loader";
import Carousel from "@/components/Carousel";
import Helper from "@/components/Helper";
import { toast } from "sonner";
import { useEffect } from "react";

export default function VocabularyPage() {
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapterId");
  const categoryId = searchParams.get("categoryId");
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["vocabulary", { chapterId: chapterId }],
    queryFn: ({ queryKey }) =>
      getVocabularies({ ...(queryKey[1] as { chapterId: string }) }),
    staleTime: 5000,
  });

  // 단어가 없는 경우
  useEffect(() => {
    if (data && data.length === 0) {
      toast.error("단어를 찾을 수 없습니다.");
      if (categoryId) {
        navigate(`/chapter?categoryId=${categoryId}`);
      } else {
        navigate(`/`);
      }
    }
  }, [categoryId, data, navigate]);

  if (isError) {
    toast.error(`[${error.name}] ${error.message}`);
    return;
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
      <Carousel data={data} />
      <Helper />
    </>
  );
}
