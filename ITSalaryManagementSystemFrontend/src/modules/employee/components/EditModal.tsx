import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, Modal, Select, Space, message } from "antd";

import { Gender, Role } from "../../../constants/enum";
import EmployeeApis from "../apis/EmployeeApis";
import { EmployeeModel, EmployeePutForm } from "../models";

type Props = {
  data: EmployeeModel;
  successCallback?: () => void;
};

export const EditModal = ({ data, successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [messageApi, contextHolder] = message.useMessage();
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

  const handleSubmit = (value: EmployeePutForm) => {
    setSending(true);
    EmployeeApis.put(data.Id, { ...value, dob: value.dob.toISOString() })
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
      })
      .catch((err) => {
        console.error(err);
        messageApi.open({
          type: "error",
          content: "Something went wrong! Please refresh page and try again later.",
        });
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
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
      >
        Edit
      </Button>
      <Modal
        title={`Edit employee ${data.EmployeeCode} - ${data.EmployeeName}`}
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
          initialValues={{
            employeeName: data.EmployeeName,
            gender: Gender[data.Gender],
            role: Role[data.Role],
            cccd: data.CCCD,
            dob: dayjs(data.Dob),
            phone: data.Phone,
            address: data.Address,
          }}
        >
          <Form.Item
            label="Name"
            name="employeeName"
            rules={[{ required: true, message: "Please input employee name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
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
            label="CMND/CCCD"
            name="cccd"
            rules={[
              { required: true, message: "Please input CMND/CCCD!" },
              {
                pattern: /^(?=(?:.{9}|.{12})$)\d*$/g,
                message: "Please input valid CMND/CCCD!",
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
