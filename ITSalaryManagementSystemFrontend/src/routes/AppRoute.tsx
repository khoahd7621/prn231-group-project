import { UserOutlined } from "@ant-design/icons";
import React from "react";

type AppRouteType = {
  path: string;
  name: string;
  icon: React.ReactNode;
};

export enum AppRouteEnum {
  DashBoard = "DashBoard",
  ManageEmployee = "ManageEmployee",
}

const AppRoute: {
  [key in AppRouteEnum]: AppRouteType;
} = {
  [AppRouteEnum.DashBoard]: {
    path: "/",
    name: "Dashboard",
    icon: <UserOutlined />,
  },
  [AppRouteEnum.ManageEmployee]: {
    path: "/manage-employee",
    name: "Manage Employee",
    icon: <UserOutlined />,
  },
};

export default AppRoute;
