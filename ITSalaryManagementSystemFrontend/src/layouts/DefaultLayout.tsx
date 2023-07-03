import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { Layout, Menu, theme } from "antd";

import { Role } from "../constants/enum";
import { useAppSelector } from "../reduxs/hooks";
import { AdminRoute, AdminRouteEnum, EmployeeRoute, EmployeeRouteEnum } from "../routes/AppRoute";

const { Header, Content, Footer, Sider } = Layout;

export const DefaultLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();
  const profileState = useAppSelector((state) => state.profile);

  const rootPath = `${location.pathname.split("/")[2] || ""}`;

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "1rem 0",
          }}
        >
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="logo"
            width="32"
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[rootPath]}
          items={
            Role.Admin === profileState.user.role
              ? Object.keys(AdminRoute).map((key) => ({
                  key: AdminRoute[key as AdminRouteEnum].path,
                  icon: AdminRoute[key as AdminRouteEnum].icon,
                  label: (
                    <Link to={AdminRoute[key as AdminRouteEnum].path}>{AdminRoute[key as AdminRouteEnum].name}</Link>
                  ),
                }))
              : Object.keys(EmployeeRoute).map((key) => ({
                  key: EmployeeRoute[key as EmployeeRouteEnum].path,
                  icon: EmployeeRoute[key as EmployeeRouteEnum].icon,
                  label: (
                    <Link to={EmployeeRoute[key as EmployeeRouteEnum].path}>
                      {EmployeeRoute[key as EmployeeRouteEnum].name}
                    </Link>
                  ),
                }))
          }
        />
      </Sider>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Copyright ©{new Date().getFullYear()} Created by Secret Billionaire
        </Footer>
      </Layout>
    </Layout>
  );
};
