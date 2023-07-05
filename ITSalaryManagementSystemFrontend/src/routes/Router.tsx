import { createBrowserRouter } from "react-router-dom";

import { DefaultLayout, SecondaryLayout } from "../layouts";
import {
  ProtectedAdmin,
  ProtectedEmployee,
  ProtectedFirstLogin,
  ProtectedLogin,
} from "../modules/authentication/components";
import {
  Attendance,
  Contract,
  DashBoard,
  EmpAttendance,
  EmpContract,
  EmpDashBoard,
  EmpLeave,
  EmpPayroll,
  Employee,
  Leave,
  Level,
  Login,
  Payroll,
  Position,
} from "../pages";
import { AdminRoute, AdminRouteEnum, EmployeeRoute, EmployeeRouteEnum } from "./AppRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: (
          <ProtectedLogin>
            <SecondaryLayout />
          </ProtectedLogin>
        ),
        children: [
          {
            index: true,
            element: <Login />,
          },
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedAdmin>
            <ProtectedFirstLogin>
              <DefaultLayout />
            </ProtectedFirstLogin>
          </ProtectedAdmin>
        ),
        children: [
          { path: AdminRoute[AdminRouteEnum.DashBoard].path, index: true, element: <DashBoard /> },
          { path: AdminRoute[AdminRouteEnum.ManagePosition].path, element: <Position /> },
          { path: AdminRoute[AdminRouteEnum.ManageLevel].path, element: <Level /> },
          { path: AdminRoute[AdminRouteEnum.ManageEmployee].path, element: <Employee /> },
          { path: AdminRoute[AdminRouteEnum.ManageContract].path, element: <Contract /> },
          { path: AdminRoute[AdminRouteEnum.ManageAttendance].path, element: <Attendance /> },
          { path: AdminRoute[AdminRouteEnum.ManageLeave].path, element: <Leave /> },
          { path: AdminRoute[AdminRouteEnum.ManagePayroll].path, element: <Payroll /> },
        ],
      },
      {
        path: "employee",
        element: (
          <ProtectedEmployee>
            <ProtectedFirstLogin>
              <DefaultLayout />
            </ProtectedFirstLogin>
          </ProtectedEmployee>
        ),
        children: [
          { path: EmployeeRoute[EmployeeRouteEnum.DashBoard].path, index: true, element: <EmpDashBoard /> },
          { path: EmployeeRoute[EmployeeRouteEnum.ManageContract].path, element: <EmpContract /> },
          { path: EmployeeRoute[EmployeeRouteEnum.ManageAttendance].path, element: <EmpAttendance /> },
          { path: EmployeeRoute[EmployeeRouteEnum.ManageLeave].path, element: <EmpLeave /> },
          { path: EmployeeRoute[EmployeeRouteEnum.ManagePayroll].path, element: <EmpPayroll /> },
        ],
      },
    ],
  },
]);

export default Router;
