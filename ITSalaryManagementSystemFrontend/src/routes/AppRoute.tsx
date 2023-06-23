import {
  AppstoreAddOutlined,
  PieChartOutlined,
  PullRequestOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
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
    icon: <PieChartOutlined />,
  },
  [AppRouteEnum.ManagePosition]: {
    path: "/manage-position",
    name: "Manage Position",
    icon: <AppstoreAddOutlined />,
  },
  [AppRouteEnum.ManageLevel]: {
    path: "/manage-level",
    name: "Manage Level",
    icon: <PullRequestOutlined />,
  },
  [AppRouteEnum.ManageEmployee]: {
    path: "/manage-employee",
    name: "Manage Employee",
    icon: <UsergroupAddOutlined />,
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
