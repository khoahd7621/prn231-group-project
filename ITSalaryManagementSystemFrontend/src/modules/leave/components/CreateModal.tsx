import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, Modal, Select, Space, message } from "antd";

import { LeaveCategory, LeaveStatus, LeaveType, Role } from "../../../constants/enum";
import { useAppSelector } from "../../../reduxs/hooks";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import LeaveApis from "../apis/LeaveApis";
import { LeaveForm } from "../models";

const { TextArea } = Input;

type Props = {
  successCallback?: () => void;
};

type OptionItem = {
  value: number;
  label: string;
};

export const CreateModal = ({ successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = React.useState<OptionItem[]>([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = React.useState<boolean>(false);
  const profileState = useAppSelector((state) => state.profile);
  const isEmp = useAppSelector((state) => state.profile?.user?.role === Role.Employee);

  useEffect(() => {
    if (!isEmp) {
      EmployeeApis.getAll()
        .then((res) => {
          setOptions(
            res.value
              .filter((v) => +Role[v.Role] === Role.Employee)
              .map((item) => ({
                value: item.Id,
                label: `${item.EmployeeCode} - ${item.EmployeeName}`,
              }))
          );
        })
        .catch((err) => console.error(err));
    }
  }, [isEmp]);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (value: LeaveForm) => {
    setSending(true);

    LeaveApis.post({
      ...value,
      employeeId: isEmp ? profileState.user.id : value.employeeId,
      status: LeaveStatus.WAITING,
      startDate: value.startDate.toISOString(),
      endDate: value.endDate.toISOString(),
    })
      .then(() => {
        setIsModalOpen(false);
        form.resetFields();
        successCallback?.();
        message.success("Leave created successfully");
      })
      .catch((error) => {
        console.error(error);
        message.error(`Error creating leave:  ${error.response?.data?.error?.message || "An error occurred."}`);
      })
      .finally(() => setSending(false));
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
    setSelectedCategoryOption(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
      >
        Create new leave
      </Button>
      <Modal
        title="Create new leave"
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
            label="Employee Code"
            name="employeeId"
            hidden={isEmp}
            rules={[{ required: !isEmp }]}
          >
            <Select
              showSearch
              disabled={isEmp}
              placeholder="Select a employee"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={options.map((key) => {
                return {
                  value: key.value,
                  label: key.label,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            initialValue={LeaveCategory.ONE_DAY_LEAVE}
            rules={[{ required: true }]}
          >
            <Select
              value={selectedCategoryOption}
              onChange={setSelectedCategoryOption}
              options={Object.keys(LeaveCategory)
                .filter((v) => isNaN(Number(v)))
                .map((key) => {
                  return {
                    value: LeaveCategory[key as keyof typeof LeaveCategory],
                    label: key.toUpperCase().split("_").join(" "),
                  };
                })}
            />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please input start date!" }]}
            initialValue={dayjs()}
          >
            <DatePicker
              placeholder="Select leave date"
              format={"DD/MM/YYYY"}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            hidden={!selectedCategoryOption}
            rules={[{ required: true, message: "Please input end date!" }]}
            initialValue={dayjs()}
          >
            <DatePicker
              placeholder="Select end date"
              format={"DD/MM/YYYY"}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            initialValue={LeaveType.ANNUAL_LEAVE}
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(LeaveType)
                .filter((v) => isNaN(Number(v)))
                .map((key) => {
                  return {
                    value: LeaveType[key as keyof typeof LeaveType],
                    label: key.toUpperCase().split("_").join(" "),
                  };
                })}
            />
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please input reason!" }]}
          >
            <TextArea
              showCount
              maxLength={100}
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
                  setSelectedCategoryOption(false);
                }}
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
