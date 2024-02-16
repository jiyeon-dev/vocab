import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SideMenu from "@/components/Navigation/SideMenu";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <main>
      <Navigation />
      <div className='container overflow-y-auto'>
        <Outlet />
      </div>
      <SideMenu />

      <Toaster position='top-center' visibleToasts='1' richColors />
    </main>
  );
}
