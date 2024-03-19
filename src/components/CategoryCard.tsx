import { Category } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardImage,
  CardBody,
  CardTitle,
} from "@/components/custom-ui/Card";

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const tagName: string = (event.target as HTMLDivElement).tagName;
    if (tagName === "BUTTON" || tagName === "path" || tagName === "svg") return;
    else navigate(`/chapter?categoryId=${category.id}`);
  };

  return (
    <Card
      editUrl={`category/edit?categoryId=${category.id}`}
      className='grid grid-cols-3 grid-flow-col'
      onClick={handleClick}
    >
      <CardImage imageURL={category?.imageURL} />
      <CardBody className='col-span-2 m-5'>
        <CardTitle className='text-2xl font-semibold'>
          {category?.name}
        </CardTitle>
        <div className='text-sm text-muted-foreground mt-4 line-clamp-3'>
          {category?.description}
        </div>
      </CardBody>
    </Card>
  );
}
