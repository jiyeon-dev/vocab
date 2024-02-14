import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import { SideMenuProvider } from "./contexts/SideMenu";
import { ThemeProvider } from "./contexts/Theme";
import CategoryPage from "./pages/Category";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <CategoryPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <SideMenuProvider>
        <RouterProvider router={router}></RouterProvider>
      </SideMenuProvider>
    </ThemeProvider>
  );
}
