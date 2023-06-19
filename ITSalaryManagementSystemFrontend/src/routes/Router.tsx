import { createBrowserRouter } from "react-router-dom";

import { DefaultLayout } from "../layouts";
import { Attendance, DashBoard, Employee, Leave, Level, Position } from "../pages";
import AppRoute, { AppRouteEnum } from "./AppRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: AppRoute[AppRouteEnum.DashBoard].path, index: true, element: <DashBoard /> },
      { path: AppRoute[AppRouteEnum.ManagePosition].path, index: true, element: <Position /> },
      { path: AppRoute[AppRouteEnum.ManageLevel].path, index: true, element: <Level /> },
      { path: AppRoute[AppRouteEnum.ManageEmployee].path, index: true, element: <Employee /> },
      { path: AppRoute[AppRouteEnum.ManageAttendance].path, index: true, element: <Attendance /> },
      { path: AppRoute[AppRouteEnum.ManageLeave].path, index: true, element: <Leave /> },
    ],
  },
]);

export default Router;
