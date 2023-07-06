import { useEffect, useState } from "react";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input } from "antd";

import AuthApis from "../modules/authentication/apis/AuthApis";
import { LoginForm } from "../modules/authentication/models";
import { useAppDispatch } from "../reduxs/hooks";
import { login } from "../reduxs/slices/authSlice";
import { fetchProfile, setProfileLoading } from "../reduxs/slices/profileSlice";

export function Login() {
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

  const onFinish = (values: LoginForm) => {
    setLoading(true);
    AuthApis.login(values)
      .then((res) => {
        form.resetFields();
        dispatch(login(res));
        dispatch(setProfileLoading(true));
        AuthApis.getProfile().then((res) => {
          dispatch(fetchProfile(res));
          dispatch(setProfileLoading(false));
        });
      })
      .catch((err) => {
        console.error(err);
        form.setFields([
          {
            name: "email",
            errors: ["Email or password is incorrect!"],
          },
          {
            name: "password",
            value: "",
          },
        ]);
        setLoading(false);
      });
  };

  return (
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
          maxWidth: "400px",
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          padding: "2rem",
          borderRadius: "0.5rem",
        }}
      >
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          disabled={loading}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.5rem",
            }}
          >
            <Image
              src="/vite.svg"
              width={60}
              preview={false}
            />
          </div>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Login to Salary Management System
          </h2>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please input valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={!submittable}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Log in
            </Button>
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
  );
}
