import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/util/http";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useRef } from "react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const target = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: ["category"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: async ({ pageParam }: any) => {
      const querySnapshot = await getCategories(pageParam || null);
      return querySnapshot;
    },
    getNextPageParam: (querySnapshot) => {
      if (!querySnapshot?.docs) return undefined;
      const lastPageParam = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (querySnapshot.size < 6) {
        return undefined;
      }
      return lastPageParam;
    },
  });

  useIntersectionObserver({
    root: null,
    target: target,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  if (isError) {
    const message = isError ? error.message : "에러가 발생했습니다.";
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-center'>{message}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className='flex flex-col gap-4 overflow-y-auto'
        style={{ height: "calc(100% - var(--header-height))" }}
      >
        {data?.pages.map((snapshot, index) => {
          const docs = snapshot.docs;
          return docs.map((doc) => (
            <CategoryCard
              key={`${doc.id}-${index}`}
              category={{ ...doc.data(), id: doc.id }}
            />
          ));
        })}
        <div ref={target} />
      </div>
      <div className='flex items-center justify-center'>
        <Link to='category/new'>
          <Button variant='ghost' className='mt-2'>
            <CiCirclePlus size={24} />
          </Button>
        </Link>
      </div>
      {(isLoading || isFetchingNextPage) && <Loader />}
    </>
  );
}
