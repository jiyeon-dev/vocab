import CategoryCard from "@/components/CategoryCard";

export default function CategoryPage() {
  const img =
    "https://firebasestorage.googleapis.com/v0/b/react-voca-455e7.appspot.com/o/hackers_yellow.png?alt=media&token=9586bf8d-435f-4794-94d9-ebb5554672ff";

  const category = {
    imageURL: img,
    name: "해커스 노랑이",
    description: "해커스 토익 보카 기출문제",
  };

  return (
    <div className='grid gap-4'>
      <CategoryCard category={category} />
      <CategoryCard />
      <CategoryCard />
    </div>
  );
}
