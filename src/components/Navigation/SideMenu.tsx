import { useSideMenuState, useSideMenuDispatch } from "@/contexts/SideMenu";

export default function SideMenu() {
  const { openMenu } = useSideMenuState();
  const dispatch = useSideMenuDispatch();
  const toggleMenu = () => dispatch({ type: "TOGGLE_MENU" });

  return (
    <>
      <div
        id='backdrop'
        className='inset-0 z-50 bg-black/80 h-full absolute rounded-3xl'
        data-state={openMenu ? "" : "closed"}
        onClick={toggleMenu}
      ></div>
      <aside
        className='w-3/4 sm:max-w-sm rounded-3xl'
        data-state={openMenu ? "" : "closed"}
      ></aside>
    </>
  );
}
