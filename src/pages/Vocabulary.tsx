import { getVocabularies } from "@/util/http";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/Loader";
import Carousel from "@/components/Carousel";
import Helper from "@/components/Helper";
import { toast } from "sonner";

export default function VocabularyPage() {
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapterId");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["vocabulary", { chapterId: chapterId }],
    queryFn: ({ queryKey }) =>
      getVocabularies({ ...(queryKey[1] as { chapterId: string }) }),
    staleTime: 5000,
  });

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
