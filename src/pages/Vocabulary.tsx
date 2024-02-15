import { getVocabularies } from "@/util/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import Carousel from "@/components/Carousel";
import { Button } from "@/components/ui/button";
import { FaRegQuestionCircle } from "react-icons/fa";

export default function VocabularyPage() {
  const { categoryId, chapterId } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["vocabulary", { chapterId: chapterId }],
    queryFn: ({ queryKey }) => getVocabularies({ ...queryKey[1] }),
    staleTime: 5000,
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
      <Carousel data={data} />

      <div className='flex justify-center'>
        <Button variant='ghost' className='rounded-full w-14 h-14'>
          <FaRegQuestionCircle
            size={24}
            style={{ fill: "var(--shadow-color)" }}
          />
        </Button>
      </div>
    </>
  );
}