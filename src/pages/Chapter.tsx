import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChapters } from "@/util/http";
import Loader from "@/components/Loader";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Chapter } from "@/types";
import { toast } from "sonner";

export default function ChapterPage() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["chapter", { categoryId: id }],
    queryFn: ({ queryKey }) => getChapters({ ...queryKey[1] }),
    staleTime: 5000,
  });

  const handleMoreClick = (event: MouseEvent, value: Chapter) => {
    event.preventDefault();
    console.log(value);
  };

  if (isError) {
    toast.error(`[${error.name}] ${error.message}`);
    return;
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className='grid gap-3 grid-cols-2 mb-8'>
      {data?.map((value) => (
        <Link
          to={value.id}
          key={value.id}
          className='relative flex items-center justify-center rounded-lg border bg-card shadow-sm h-36'
        >
          <h1>{value.name}</h1>
          <Button
            variant='ghost'
            className='absolute top-0 right-0 rounded-full'
            onClick={(event) => handleMoreClick(event, value)}
          >
            <BsThreeDots />
          </Button>
        </Link>
      ))}
    </div>
  );
}
