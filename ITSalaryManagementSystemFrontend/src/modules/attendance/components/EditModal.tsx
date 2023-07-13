import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, notification } from "antd";

import { RangePickerProps } from "antd/es/date-picker";
import { AttendanceType } from "../../../constants/enum";
import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceModel, AttendancePutForm } from "../models";

type Props = {
  data: AttendanceModel;
  successCallback?: () => void;
};
type NotificationType = "success" | "info" | "warning" | "error";
export const EditModal = ({ data, successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmit = (value: AttendancePutForm) => {
    setSending(true);
    AttendanceApis.put(data.Id, { ...value, date: value.date.toISOString() })
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
        openNotificationWithIcon("success", "Edit", "Edit attendance success");
      })
      .catch((error) => {
        console.error(error);
        openNotificationWithIcon("error", "Edit", error?.response?.data?.error?.message);
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
        title={`Edit Attendance ${(data.User as any).EmployeeCode} - ${(data.User as any).EmployeeName}`}
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
          style={{ width: 450, margin: "2rem 0" }}
          autoComplete="off"
          onFinish={handleSubmit}
          initialValues={{
            employeeId: data.EmployeeId,
            date: dayjs(data.Date),
            hour: data.Hour,
            otHour: data.OTHour,
            type: data.Type,
          }}
        >
          <Form.Item
            label="Employee"
            name="employeeId"
            rules={[{ required: true, message: "Please select employee!" }]}
          >
            <Input
              type="hidden"
              readOnly
            />
            <Input
              value={(data.User as any).EmployeeCode}
              readOnly
            />
          </Form.Item>
          <Form.Item
            label="Date of work"
            name="date"
            rules={[{ required: true, message: "Please input date of work!" }]}
          >
            <DatePicker
              disabledDate={disabledDate}
              placeholder="Select date of work"
              style={{
                width: "100%",
              }}
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
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
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
