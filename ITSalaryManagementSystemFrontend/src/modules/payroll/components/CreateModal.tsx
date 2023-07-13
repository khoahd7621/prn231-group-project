import { useEffect, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, DatePicker, Form, Modal, Select, Space, Spin, Typography, message } from "antd";

import dayjs from "dayjs";
import { Role } from "../../../constants/enum";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import { EmployeeModel } from "../../employee/models";
import PayrollApis from "../apis/PayrollApis";
import { CreateForm, CreatePayload } from "../models";

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 24 }}
    spin
  />
);

type Props = {
  successCallback?: () => void;
};

const { Title } = Typography;

export const CreateModal = ({ successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [messageApi, contextHolder] = message.useMessage();

  const [employees, setEmployees] = useState<EmployeeModel[]>([]);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchEmployee();
  }, []);

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

  const fetchEmployee = () => {
    EmployeeApis.getAll()
      .then((res) => setEmployees(res.value.filter((v) => +Role[v.Role] === Role.Employee)))
      .catch((error) => console.error(error));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (value: CreateForm) => {
    setSending(true);
    setErrorMessage("");
    setHasSubmitted(true);
    const createPayload: CreatePayload = {
      ...value,
      dateTime: value.dateTime.format("YYYY-MM-DD"),
    };
    PayrollApis.post(createPayload)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Create payroll successfully!",
        });
        handleCancel();
        successCallback?.();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error(error);
        if (error.response?.status === 400) {
          setErrorMessage(error.response?.data?.error?.message);
          messageApi.open({
            type: "error",
            content: error.response?.data?.error?.message,
          });
        } else {
          messageApi.open({
            type: "error",
            content: "Create payroll failed! Please refresh page and try again!",
          });
        }
      })
      .finally(() => {
        setSending(false);
      });
  };

  const handleCancel = () => {
    if (sending) return;
    form.resetFields();
    setErrorMessage("");
    setHasSubmitted(false);
    setIsModalOpen(false);
    if (hasSubmitted && successCallback) successCallback();
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
      >
        Create new payroll
      </Button>
      <Modal
        title="Create new payroll"
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
            label="Employee"
            name="employeeId"
            rules={[{ required: true, message: "Please choose an employee!" }]}
          >
            <Select
              showSearch
              placeholder="Select an employee"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={employees.map((v) => ({
                value: v.Id,
                label: `${v.EmployeeCode} - ${v.EmployeeName}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Date"
            name="dateTime"
            rules={[{ required: true, message: "Please input date!" }]}
            initialValue={dayjs().startOf("month")}
          >
            <DatePicker
              placeholder="Input or select date"
              picker="month"
              format={"MM/YYYY"}
              style={{
                width: "100%",
              }}
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
                onClick={() => {
                  form.resetFields();
                  setHasSubmitted(false);
                  setErrorMessage("");
                }}
                disabled={sending}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div>
          {!hasSubmitted && <Title level={5}>Please select an employee and date to create new payroll</Title>}
          {sending && (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Spin indicator={antIcon} />
            </div>
          )}
          {hasSubmitted && !sending && (
            <Alert
              message={errorMessage || "Create payroll failed! Please refresh page and try again!"}
              type="error"
            />
          )}
        </div>
      </Modal>
    </>
  );
};
