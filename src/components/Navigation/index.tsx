import { Button } from "../ui/button";
import { MdOutlineMenu } from "react-icons/md";
import ThemeToggleButton from "./ThemeToggleButton";
import { useSideMenuDispatch } from "@/contexts/SideMenu";

export default function Navigation() {
  const dispatch = useSideMenuDispatch();
  const toggleMenu = () => dispatch({ type: "TOGGLE_MENU" });

  return (
    <header className='sticky flex text-center items-center mx-10'>
      <Button variant='ghost' className='rounded-full' onClick={toggleMenu}>
        <MdOutlineMenu size={24} />
      </Button>
      <h1 className='grow'>Category</h1>
      <ThemeToggleButton />
    </header>
  );
}
