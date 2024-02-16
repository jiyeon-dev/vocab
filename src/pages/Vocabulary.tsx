import { getVocabularies } from "@/util/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import Carousel from "@/components/Carousel";
import Helper from "@/components/Helper";
import { toast } from "sonner";

export default function VocabularyPage() {
  const { categoryId, chapterId } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["vocabulary", { chapterId: chapterId }],
    queryFn: ({ queryKey }) => getVocabularies({ ...queryKey[1] }),
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
