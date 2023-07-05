import {
  AppstoreAddOutlined,
  AuditOutlined,
  PieChartOutlined,
  PullRequestOutlined,
  NodeExpandOutlined,
  UsergroupAddOutlined,
  PoweroffOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import React from "react";

type AppRouteType = {
  path: string;
  name: string;
  icon: React.ReactNode;
};

export enum AdminRouteEnum {
  DashBoard = "DashBoard",
  ManagePosition = "ManagePosition",
  ManageLevel = "ManageLevel",
  ManageEmployee = "ManageEmployee",
  ManageContract = "ManageContract",
  ManageAttendance = "ManageAttendance",
  ManageLeave = "ManageLeave",
  ManagePayroll = "ManagePayroll",
}

export const AdminRoute: {
  [key in AdminRouteEnum]: AppRouteType;
} = {
  [AdminRouteEnum.DashBoard]: {
    path: "",
    name: "Dashboard",
    icon: <PieChartOutlined />,
  },
  [AdminRouteEnum.ManagePosition]: {
    path: "manage-position",
    name: "Manage Position",
    icon: <AppstoreAddOutlined />,
  },
  [AdminRouteEnum.ManageLevel]: {
    path: "manage-level",
    name: "Manage Level",
    icon: <PullRequestOutlined />,
  },
  [AdminRouteEnum.ManageEmployee]: {
    path: "manage-employee",
    name: "Manage Employee",
    icon: <UsergroupAddOutlined />,
  },
  [AdminRouteEnum.ManageContract]: {
    path: "manage-contract",
    name: "Manage Contract",
    icon: <AuditOutlined />,
  },
  [AdminRouteEnum.ManageAttendance]: {
    path: "manage-attendance",
    name: "Manage Attendance",
    icon: <NodeExpandOutlined />,
  },
  [AdminRouteEnum.ManageLeave]: {
    path: "manage-leave",
    name: "Manage Leave",
    icon: <PoweroffOutlined />,
  },
  [AdminRouteEnum.ManagePayroll]: {
    path: "manage-payroll",
    name: "Manage Payroll",
    icon: <FileUnknownOutlined />,
  },
};

export enum EmployeeRouteEnum {
  DashBoard = "DashBoard",
  ManageContract = "ManageContract",
  ManageAttendance = "ManageAttendance",
  ManageLeave = "ManageLeave",
  ManagePayroll = "ManagePayroll",
}

export const EmployeeRoute: {
  [key in EmployeeRouteEnum]: AppRouteType;
} = {
  [EmployeeRouteEnum.DashBoard]: {
    path: "",
    name: "Dashboard",
    icon: <PieChartOutlined />,
  },
  [EmployeeRouteEnum.ManageContract]: {
    path: "manage-contract",
    name: "Manage Contract",
    icon: <AuditOutlined />,
  },
  [EmployeeRouteEnum.ManageAttendance]: {
    path: "manage-attendance",
    name: "Manage Attendance",
    icon: <NodeExpandOutlined />,
  },
  [EmployeeRouteEnum.ManageLeave]: {
    path: "manage-leave",
    name: "Manage Leave",
    icon: <PoweroffOutlined />,
  },
  [EmployeeRouteEnum.ManagePayroll]: {
    path: "manage-payroll",
    name: "Manage Payroll",
    icon: <FileUnknownOutlined />,
  },
};
