import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";
import { QueryClientProvider } from "@tanstack/react-query";
import { SideMenuProvider } from "./contexts/SideMenu";
import { ThemeProvider } from "./contexts/Theme";
import CategoryPage from "./pages/Category";
import ChapterPage from "./pages/Chapter";
import { queryClient } from "./util/http";
import VocabularyPage from "./pages/Vocabulary";
import ErrorPage from "./pages/Error";
import NewCategory, { action as categoryAction } from "./pages/NewCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CategoryPage />,
      },
      {
        path: "category/new",
        element: <NewCategory />,
        action: categoryAction,
      },
    ],
  },
  {
    path: "/chapter",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ChapterPage />,
      },
      {
        path: ":name",
        element: <VocabularyPage />,
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
