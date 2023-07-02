import { useEffect, useState } from "react";

import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Select,
  Space
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { AttendanceType } from "../../../constants/enum";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import { EmployeeModel } from "../../employee/models";
import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceForm } from "../models";

type Props = {
  successCallback?: () => void;
};

export const CreateModal = ({ successCallback }: Props) => {
  type DataType = {
    key: number;
  } & EmployeeModel;
  type OptionItem = {
    value: number;
    label: string;
  };
  const toDay = dayjs(Date.now());
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [widthModal, setWidthModal] = useState<number>(500);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<OptionItem[]>([]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current > dayjs().endOf("week") || current < dayjs().startOf("week");
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
        console.log(res.value);
        setEmployees(
          res.value.map((item) => ({
            value: item.Id,
            label: item.EmployeeCode,
          }))
        );
      })
      .catch((err) => console.log(err));
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
      <Button type="primary" onClick={showModal}>
        Create new employee
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
            onFinish={handleSubmit}
            initialValues={{
              date: dayjs(toDay),
              hour: 8,
              otHour: 0,
              type: AttendanceType.Offline,
            }}
          >
            <Form.Item
              label="Employee"
              name="employeeId"
              rules={[{ required: true, message: "Please select employee!" }]}
            >
              <Select
                options={employees.map((key) => {
                  return {
                    value: key.value,
                    label: key.label,
                  };
                })}
              />
            </Form.Item>
            <Form.Item
              label="Date of work"
              name="date"
              rules={[
                { required: true, message: "Please input date of work!" },
              ]}
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
              <InputNumber min={1} max={8} />
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
              <InputNumber min={0} max={8} />
            </Form.Item>
            <Form.Item label="Type" name="type" rules={[{ required: true }]}>
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
                <Button htmlType="button" onClick={() => form.resetFields()}>
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
