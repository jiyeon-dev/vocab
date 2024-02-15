import { Link } from "react-router-dom";

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const style = {
    background: `url('${category?.imageURL}'), url('/no-image.jpeg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <Link
      to={category.id}
      className='grid grid-cols-3 grid-flow-col rounded-lg border bg-card text-card-foreground shadow-sm h-36'
    >
      <div className='h-36 rounded-s-lg' style={style}></div>

      <div className='col-span-2 m-5'>
        <h3 className='text-2xl font-semibold leading-none tracking-tight truncate'>
          {category?.name}
        </h3>

        <p className='text-sm text-muted-foreground mt-4 truncate whitespace-normal'>
          {category?.description}
        </p>
      </div>
    </Link>
  );
}
