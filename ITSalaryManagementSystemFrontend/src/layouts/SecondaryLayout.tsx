import { Outlet } from "react-router-dom";

import { Layout } from "antd";

const { Content } = Layout;

const contentStyle: React.CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  backgroundImage:
    "url(https://media.istockphoto.com/id/837011094/photo/defocused-blurred-motion-abstract-background-orange-yellow.jpg?s=612x612&w=0&k=20&c=S2NGfIxSX4AzJoHgtv1gL1IS7jmdVYUX51VDApSs63s=)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

export function SecondaryLayout() {
  return (
    <Layout>
      <Content style={contentStyle}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        ></div>
        <Outlet />
      </Content>
    </Layout>
  );
}
