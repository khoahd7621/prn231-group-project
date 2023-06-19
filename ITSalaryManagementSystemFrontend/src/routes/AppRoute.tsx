import { UserOutlined } from "@ant-design/icons";
import React from "react";

type AppRouteType = {
  path: string;
  name: string;
  icon: React.ReactNode;
};

export enum AppRouteEnum {
  DashBoard = "DashBoard",
  ManagePosition = "ManagePosition",
  ManageLevel = "ManageLevel",
  ManageEmployee = "ManageEmployee",
  ManageAttendance = "ManageAttendance",
  ManageLeave = "ManageLeave",
}

const AppRoute: {
  [key in AppRouteEnum]: AppRouteType;
} = {
  [AppRouteEnum.DashBoard]: {
    path: "/",
    name: "Dashboard",
    icon: <UserOutlined />,
  },
  [AppRouteEnum.ManagePosition]: {
    path: "/manage-position",
    name: "Manage Position",
    icon: <UserOutlined />,
  },
  [AppRouteEnum.ManageLevel]: {
    path: "/manage-level",
    name: "Manage Level",
    icon: <UserOutlined />,
  },
  [AppRouteEnum.ManageEmployee]: {
    path: "/manage-employee",
    name: "Manage Employee",
    icon: <UserOutlined />,
  },
  [AppRouteEnum.ManageAttendance]: {
    path: "/manage-attendance",
    name: "Manage Attendance",
    icon: <UserOutlined />,
  },
  [AppRouteEnum.ManageLeave]: {
    path: "/manage-leave",
    name: "Manage Leave",
    icon: <UserOutlined />,
  },
};

export default AppRoute;
