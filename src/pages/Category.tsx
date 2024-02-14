import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/util/http";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useRef, useState } from "react";
import { Category } from "@/types";
import Loader from "@/components/Loader";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const target = useRef<HTMLDivElement>(null);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: ["category"],
      queryFn: async ({ pageParam = 0 }) => {
        const querySnapshot = await getCategories(pageParam);
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

  return (
    <>
      <div className='grid gap-4'>
        {categories.map((category, index) => (
          <CategoryCard key={`${category.id}-${index}`} category={category} />
        ))}
      </div>
      {(isLoading || isFetchingNextPage) && <Loader />}
      <div ref={target} />
    </>
  );
}
