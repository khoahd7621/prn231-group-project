import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Button, DatePicker, Form, InputNumber, Modal, Select, Space, notification } from "antd";
import { RangePickerProps } from "antd/es/date-picker";

import { AttendanceType, Role } from "../../../constants/enum";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceEmployeeForm, AttendanceForm } from "../models";

type Props = {
  isEmp: boolean;
  successCallback?: () => void;
};

type OptionItem = {
  value: number;
  label: string;
};

type NotificationType = "success" | "info" | "warning" | "error";

export const CreateModal = ({ isEmp, successCallback }: Props) => {
  const TODAY = dayjs(Date.now());
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [widthModal, setWidthModal] = useState<number>(500);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<OptionItem[]>([]);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, message: string, description: string) => {
    api[type]({
      message: message,
      description: description,
      duration: 1,
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current < dayjs().startOf("week") || current.day() === 0 || current.day() === 6;
  };

  useEffect(() => {
    form.validateFields([], { validateOnly: true }).then(
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
      .then((res) => {
        setEmployees(
          res.value
            .filter((v) => +Role[v.Role] === Role.Employee)
            .map((item) => ({
              value: item.Id,
              label: `${item.EmployeeCode} - ${item.EmployeeName}`,
            }))
        );
      })
      .catch((err) => console.error(err));
  };

  const showModal = () => {
    fetchEmployee();
    setWidthModal(500);
    setIsModalOpen(true);
  };

  const handleSubmit = (value: AttendanceForm) => {
    setSending(true);
    AttendanceApis.post({
      ...value,
      employeeId: Number(value.employeeId),
      date: value.date.toISOString(),
    })
      .then(() => {
        setIsModalOpen(false);
        form.resetFields();
        successCallback?.();
        openNotificationWithIcon("success", "Create", "Create attendance success");
      })
      .catch((error) => {
        openNotificationWithIcon("error", "Create", error.response.data.error.message);
      })
      .finally(() => setSending(false));
  };
  const handleEmplSubmit = (value: AttendanceEmployeeForm) => {
    setSending(true);
    AttendanceApis.postByEmployee({
      ...value,
      date: value.date.toISOString(),
    })
      .then(() => {
        setIsModalOpen(false);
        form.resetFields();
        successCallback?.();
        openNotificationWithIcon("success", "Create", "Create attendance success");
      })
      .catch((error) => {
        console.error(error);
        openNotificationWithIcon("error", "Create", error.response.data.message);
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
        Create new attendance
      </Button>
      <>
        <Modal
          title="Create new Attendance"
          open={isModalOpen}
          footer={null}
          cancelButtonProps={{
            disabled: sending,
          }}
          onCancel={handleCancel}
          width={widthModal}
        >
          <Form
            disabled={sending}
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600, margin: "2rem 0" }}
            autoComplete="off"
            onFinish={isEmp == false ? handleSubmit : handleEmplSubmit}
            initialValues={{
              date: dayjs(TODAY),
              hour: 8,
              otHour: 0,
              type: AttendanceType.Offline,
            }}
          >
            {isEmp === false ? (
              <Form.Item
                hidden={isEmp}
                label="Employee"
                name="employeeId"
                rules={[{ required: true, message: "Please select employee!" }]}
              >
                <Select
                  placeholder="Select an employee"
                  showSearch
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={employees}
                />
              </Form.Item>
            ) : (
              <></>
            )}
            <Form.Item
              label="Date of work"
              name="date"
              rules={[{ required: true, message: "Please input date of work!" }]}
            >
              <DatePicker
                disabledDate={disabledDate}
                placeholder="Select date of work"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Hour"
              name="hour"
              rules={[
                {
                  required: true,
                  message: "Please input number of work hour!",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={8}
              />
            </Form.Item>
            <Form.Item
              label="OT Hour"
              name="otHour"
              rules={[
                {
                  required: true,
                  message: "Please input number of OT hour!",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={8}
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true }]}
            >
              <Select
                options={Object.keys(AttendanceType)
                  .filter((v) => isNaN(Number(v)))
                  .map((key) => {
                    return {
                      value: AttendanceType[key as keyof typeof AttendanceType],
                      label: key,
                    };
                  })}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Space>
                {isEmp ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!submittable}
                    loading={sending}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!submittable || form.isFieldsTouched() === false}
                    loading={sending}
                  >
                    Submit
                  </Button>
                )}
                <Button
                  htmlType="button"
                  onClick={() => form.resetFields()}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600, margin: "2rem 0" }}
          ></Form>
        </Modal>
      </>
    </>
  );
};
