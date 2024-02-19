import { Category } from "@/types";
import { useNavigate } from "react-router-dom";
import EditButton from "./EditButton";

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const style = {
    background: `url('${category?.imageURL}'), url('/no-image.jpeg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const tagName: string = (event.target as HTMLDivElement).tagName;
    if (tagName === "BUTTON" || tagName === "path" || tagName === "svg") return;
    else navigate(`/chapter?categoryId=${category.id}`);
  };

  return (
    <div
      className='grid grid-cols-3 grid-flow-col rounded-lg border bg-card text-card-foreground shadow-sm h-36 relative cursor-pointer select-none'
      onClick={handleClick}
    >
      <div className='h-36 rounded-s-lg' style={style}></div>

      <div className='col-span-2 m-5'>
        <h3 className='text-2xl font-semibold leading-none tracking-tight truncate'>
          {category?.name}
        </h3>

        <div className='text-sm text-muted-foreground mt-4 line-clamp-3'>
          {category?.description}
        </div>
      </div>

      <EditButton url={`category/edit?categoryId=${category.id}`} />
    </div>
  );
}
