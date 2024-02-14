import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SideMenu from "@/components/Navigation/SideMenu";

export default function RootLayout() {
  console.log("re-render - RootLayout");

  return (
    <main>
      <Navigation />
      <div className='container overflow-y-auto'>
        <Outlet />
      </div>
      <SideMenu />
    </main>
  );
}
