import { useEffect, useState } from "react";

import { Button, Form, Input, Layout, Space } from "antd";

import { useAppDispatch } from "../../../reduxs/hooks";
import { logout } from "../../../reduxs/slices/authSlice";
import { removeProfile, updateFirstLogin } from "../../../reduxs/slices/profileSlice";
import AuthApis from "../apis/AuthApis";
import { ChangeFirstPassword as ChangeFirstPasswordModel } from "../models";

const { Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const contentStyle: React.CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  backgroundImage:
    "url(https://media.istockphoto.com/id/837011094/photo/defocused-blurred-motion-abstract-background-orange-yellow.jpg?s=612x612&w=0&k=20&c=S2NGfIxSX4AzJoHgtv1gL1IS7jmdVYUX51VDApSs63s=)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

export function ChangeFirstPassword() {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const dispatch = useAppDispatch();

  const [submittable, setSubmittable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onFinish = (values: ChangeFirstPasswordModel) => {
    setLoading(true);
    AuthApis.changeFirstPassword(values)
      .then(() => {
        form.resetFields();
        dispatch(updateFirstLogin());
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeProfile());
  };

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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "100%",
              maxWidth: "450px",
              boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
              padding: "2rem",
              borderRadius: "0.5rem",
            }}
          >
            <Form
              {...formItemLayout}
              form={form}
              onFinish={onFinish}
              disabled={loading}
            >
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "2rem",
                }}
              >
                You must change your default password before using this app!
              </h3>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("The new password that you entered do not match!"));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Space>
                  <Button
                    disabled={!submittable}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Submit
                  </Button>
                  <Button htmlType="reset">Reset</Button>
                  <Button
                    type="primary"
                    danger
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
              color: "white",
            }}
          >
            Copyright ©{new Date().getFullYear()} Created by Secret Billionaire with ❤️
          </div>
        </div>
      </Content>
    </Layout>
  );
}
