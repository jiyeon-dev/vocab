import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import { QueryClientProvider } from "@tanstack/react-query";
import { SideMenuProvider } from "./contexts/SideMenu";
import { ThemeProvider } from "./contexts/Theme";
import CategoryPage from "./pages/Category";
import { queryClient } from "./util/http";

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SideMenuProvider>
          <RouterProvider router={router}></RouterProvider>
        </SideMenuProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
