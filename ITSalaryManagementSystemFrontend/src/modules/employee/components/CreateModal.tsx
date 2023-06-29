import { useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import { EmployeeType, Gender, Role } from "../../../constants/enum";
import EmployeeApis from "../apis/EmployeeApis";
import { EmployeeForm } from "../models";

type Props = {
  successCallback?: () => void;
};

export const CreateModal = ({ successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (value: EmployeeForm) => {
    setSending(true);
    EmployeeApis.post({
      ...value,
      dob: value.dob.toISOString(),
    })
      .then(() => {
        setIsModalOpen(false);
        form.resetFields();
        successCallback?.();
      })
      .catch((error) => {
        console.log(error);
        alert("Create employee failed! Please refresh page and try again!");
      })
      .finally(() => setSending(false));
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
      >
        Create new employee
      </Button>
      <Modal
        title="Create new employee"
        open={isModalOpen}
        footer={null}
        cancelButtonProps={{
          disabled: sending,
        }}
        onCancel={handleCancel}
      >
        <Form
          disabled={sending}
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600, margin: "2rem 0" }}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            initialValue={Gender.Male}
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(Gender)
                .filter((v) => isNaN(Number(v)))
                .map((key) => {
                  return {
                    value: Gender[key as keyof typeof Gender],
                    label: key,
                  };
                })}
            />
          </Form.Item>
          <Form.Item
            label="Date of birth"
            name="dob"
            rules={[{ required: true, message: "Please input date of birth!" }]}
          >
            <DatePicker
              placeholder="Select date of birth"
              format={"DD/MM/YYYY"}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="CCCD"
            name="cccd"
            rules={[
              { required: true, message: "Please input CCCD!" },
              {
                pattern: /^\d{12}$/g,
                message: "Please input valid CCCD!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input phone!" },
              {
                pattern: /(84|0[3|5|7|8|9])+(\d{8})\b/,
                message: "Please input valid phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            initialValue={Role.Employee}
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(Role)
                .filter((v) => isNaN(Number(v)))
                .map((key) => {
                  return {
                    value: Role[key as keyof typeof Role],
                    label: key,
                  };
                })}
            />
          </Form.Item>
          <Form.Item
            label="Employee Type"
            name="typeEmployee"
            initialValue={EmployeeType.FullTime}
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(EmployeeType)
                .filter((v) => isNaN(Number(v)))
                .map((key) => {
                  return {
                    value: EmployeeType[key as keyof typeof EmployeeType],
                    label: key,
                  };
                })}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!submittable || form.isFieldsTouched() === false}
                loading={sending}
              >
                Submit
              </Button>
              <Button
                htmlType="button"
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
