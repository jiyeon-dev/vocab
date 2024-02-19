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
import NewCategory, { action as newCategoryAction } from "./pages/NewCategory";
import EditCategory, {
  action as editCategoryAction,
  loader as categoryDetailLoader,
} from "./pages/EditCategory";
import NewChapter, { action as newChapterAction } from "./pages/NewChapter";
import EditChapter, {
  action as editChapterAction,
  loader as ChapterDetailLoader,
} from "./pages/EditChapter";

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
        action: newCategoryAction,
      },
      {
        path: "category/edit",
        id: "category-detail",
        element: <EditCategory />,
        action: editCategoryAction,
        loader: categoryDetailLoader,
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
        path: "new",
        element: <NewChapter />,
        action: newChapterAction,
      },
      {
        path: "edit",
        id: "chapter-detail",
        element: <EditChapter />,
        action: editChapterAction,
        loader: ChapterDetailLoader,
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
