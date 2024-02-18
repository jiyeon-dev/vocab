import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/util/http";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useRef, useState } from "react";
import { Category } from "@/types";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const target = useRef<HTMLDivElement>(null);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: ["category"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn: async ({ pageParam }: any) => {
        const querySnapshot = await getCategories(pageParam || null);
        const newData: Category[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategories((prev) => [...prev, ...newData]);
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

  if (isLoading || isFetchingNextPage) {
    return <Loader />;
  }

  return (
    <>
      <div
        className='flex flex-col gap-4 overflow-y-auto'
        style={{ height: "calc(100% - var(--header-height))" }}
      >
        {categories.map((category, index) => (
          <CategoryCard key={`${category.id}-${index}`} category={category} />
        ))}
      </div>
      <div ref={target} />

      <div className='flex items-center justify-center'>
        <Link to='category/new'>
          <Button variant='ghost' className='mt-2'>
            <CiCirclePlus size={24} />
          </Button>
        </Link>
      </div>
    </>
  );
}
