import { useSideMenuState, useSideMenuDispatch } from "@/contexts/SideMenu";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { FaGithub, FaBloggerB } from "react-icons/fa";

export default function SideMenu() {
  const { openMenu } = useSideMenuState();
  const dispatch = useSideMenuDispatch();
  const toggleMenu = () => dispatch({ type: "TOGGLE_MENU" });

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

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
      >
        <div className='flex flex-col h-full items-center justify-center'>
          <NavLink
            to='/'
            className={({ isActive }) => (isActive ? "underline" : undefined)}
            onClick={toggleMenu}
            end
          >
            <h1 className='text-2xl font-bold m-2 hover:underline'>Category</h1>
          </NavLink>
          {location.pathname !== "/" && (
            <NavLink
              to={`/chapter?categoryId=${categoryId}`}
              className={
                location.pathname === "/chapter" ? "underline" : undefined
              }
              onClick={toggleMenu}
            >
              <h1 className='text-2xl font-bold m-2 hover:underline'>
                Chapter
              </h1>
            </NavLink>
          )}
        </div>
        <div className='absolute bottom-5 w-full flex flex-col items-center justify-center'>
          <p>created by. jiyeon</p>
          <p className='mt-3'>
            <a href='https://github.com/jiyeon-dev/vocab'>
              <FaGithub size={20} />
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}
