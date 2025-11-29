import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const Editor = lazy(() => import("../components/editor/Index"));

export const router = createBrowserRouter([
  {
    path: "/editor",
    Component: Editor,
  },
]);