import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [],
  },
]);

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
