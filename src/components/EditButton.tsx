import { Button } from "@/components/ui/button";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MoreButtonDropDown({ url }: { url: string }) {
  return (
    <Link to={url}>
      <Button variant='ghost' className='absolute top-0 right-0 rounded-full'>
        <FaPencilAlt />
      </Button>
    </Link>
  );
}
