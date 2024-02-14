import { Button } from "../ui/button";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useThemeDispatch, useThemeState } from "@/contexts/Theme";

export default function ThemeToggleButton() {
  const { theme } = useThemeState();
  const dispatch = useThemeDispatch();

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });

  return (
    <Button variant='ghost' className='rounded-full' onClick={toggleTheme}>
      {theme === "light" && <MdDarkMode size={24} />}
      {theme === "dark" && <MdLightMode size={24} />}
    </Button>
  );
}
