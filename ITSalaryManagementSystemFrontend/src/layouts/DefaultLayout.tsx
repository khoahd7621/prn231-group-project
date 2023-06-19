import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { Layout, Menu, theme } from "antd";

import AppRoute, { AppRouteEnum } from "../routes/AppRoute";

const { Header, Content, Footer, Sider } = Layout;

export const DefaultLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();

  const rootPath = `/${location.pathname.split("/")[1]}`;
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
          items={Object.keys(AppRoute).map((key) => ({
            key: AppRoute[key as AppRouteEnum].path,
            icon: AppRoute[key as AppRouteEnum].icon,
            label: <Link to={AppRoute[key as AppRouteEnum].path}>{AppRoute[key as AppRouteEnum].name}</Link>,
          }))}
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
