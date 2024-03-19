import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChapters } from "@/util/http";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { Chapter } from "@/types";
import { Card, CardTitle } from "@/components/custom-ui/Card";

export default function ChapterPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("categoryId");
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["chapter", { categoryId: id }],
    queryFn: ({ queryKey }) =>
      getChapters({ ...(queryKey[1] as { categoryId: string }) }),
    staleTime: 5000,
  });

  if (!id) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-center'>categoryId를 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (isError) {
    toast.error(`[${error.name}] ${error.message}`);
    return;
  }

  if (isPending) {
    return <Loader />;
  }

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    value: Chapter
  ) => {
    const tagName: string = (event.target as HTMLDivElement).tagName;
    if (tagName === "BUTTON" || tagName === "path" || tagName === "svg") return;
    navigate(`/chapter/${value.name}?categoryId=${id}&chapterId=${value.id}`);
  };

  return (
    <>
      <div
        className='grid gap-3 grid-cols-2 overflow-y-auto'
        style={{ maxHeight: "calc(100% - var(--header-height))" }}
      >
        {data?.map((value) => (
          <Card
            key={value.id}
            editUrl={`edit?chapterId=${value.id}`}
            className='flex items-center justify-center'
            onClick={(event) => handleClick(event, value)}
          >
            <CardTitle>{value.name}</CardTitle>
          </Card>
        ))}
      </div>

      {data.length < 30 && (
        <div className='flex items-center justify-center absolute bottom-3 w-full left-0'>
          <Link to={`new?categoryId=${id}`}>
            <Button variant='ghost' className='mt-2'>
              <CiCirclePlus size={24} />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
