import { createBrowserRouter } from "react-router-dom";

import { DefaultLayout } from "../layouts";
import { DashBoard } from "../pages";
import AppRoute, { AppRouteEnum } from "./AppRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: AppRoute[AppRouteEnum.DashBoard].path, index: true, element: <DashBoard /> },
      { path: AppRoute[AppRouteEnum.ManageEmployee].path, index: true, element: <DashBoard /> },
    ],
  },
]);

export default Router;
