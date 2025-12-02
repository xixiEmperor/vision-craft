import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const Editor = lazy(() => import("../components/editor/Index"));
const Demo = lazy(() => import("../components/DndKitDemo"));

export const router = createBrowserRouter([
  {
    path: "/editor",
    Component: Editor,
  },
  {
    path: "/demo",
    Component: Demo,
  }
]);