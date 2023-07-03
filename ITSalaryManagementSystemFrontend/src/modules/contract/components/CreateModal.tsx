import { useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space } from "antd";

import { EmployeeType, Gender, Role, SalaryType } from "../../../constants/enum";
import ContractApis from "../apis/ContractApis";
import { CreateForm } from "../models";
import { EmployeeModel } from "../../employee/models";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import { LevelModel } from "../../level/models";
import { PositionModel } from "../../position/models";
import LevelApis from "../../level/apis/LevelApis";
import PositionApis from "../../position/apis/PositionApis";

type Props = {
  successCallback?: () => void;
};

export const CreateModal = ({ successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [employees, setEmployees] = useState<EmployeeModel[]>([]);
  const [levels, setLevels] = useState<LevelModel[]>([]);
  const [positions, setPositions] = useState<PositionModel[]>([]);

  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployee();
    fetchLevel();
    fetchPosition();
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
      .catch((error) => console.log(error));
  };

  const fetchLevel = () => {
    LevelApis.getAll()
      .then((res) => setLevels(res.value))
      .catch((error) => console.log(error));
  };

  const fetchPosition = () => {
    PositionApis.getAll()
      .then((res) => setPositions(res.value))
      .catch((error) => console.log(error));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (value: CreateForm) => {
    setSending(true);
    ContractApis.post({
      ...value,
      startDate: value.startDate.toISOString(),
      endDate: value.endDate.toISOString(),
    })
      .then(() => {
        setIsModalOpen(false);
        form.resetFields();
        successCallback?.();
      })
      .catch((error) => {
        console.log(error);
        alert("Create contract failed! Please refresh page and try again!");
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
        Create new contract
      </Button>
      <Modal
        title="Create new contract"
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
            label="Position"
            name="positionId"
            rules={[{ required: true, message: "Please choose a position!" }]}
          >
            <Select
              showSearch
              placeholder="Select a position"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={positions.map((v) => ({
                value: v.Id,
                label: v.PositionName,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Level"
            name="levelId"
            rules={[{ required: true, message: "Please choose a level!" }]}
          >
            <Select
              showSearch
              placeholder="Select a level"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={levels.map((v) => ({
                value: v.Id,
                label: v.LevelName,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Employee Type"
            name="employeeType"
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
          <Form.Item
            label="Salary Type"
            name="salaryType"
            initialValue={SalaryType.Gross}
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(SalaryType)
                .filter((v) => isNaN(Number(v)))
                .map((key) => {
                  return {
                    value: SalaryType[key as keyof typeof SalaryType],
                    label: key,
                  };
                })}
            />
          </Form.Item>
          <Form.Item
            label="Start date"
            name="startDate"
            rules={[{ required: true, message: "Please input start date!" }]}
          >
            <DatePicker
              placeholder="Select start date"
              format={"DD/MM/YYYY"}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="End date"
            name="endDate"
            rules={[{ required: true, message: "Please input end date!" }]}
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
            label="Base salary"
            name="baseSalary"
            initialValue={1}
            rules={[{ required: true, message: "Please input base salary!" }]}
          >
            <InputNumber
              min={1}
              addonAfter="VND"
            />
          </Form.Item>
          <Form.Item
            label="Insurance rate"
            name="insuranceRate"
            initialValue={10}
            rules={[{ required: true, message: "Please input insurance rate!" }]}
          >
            <InputNumber
              min={1}
              max={100}
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item
            label="Tax rate"
            name="taxRate"
            initialValue={10}
            rules={[{ required: true, message: "Please input tax rate!" }]}
          >
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item
            label="Day off per year"
            name="dateOffPerYear"
            initialValue={14}
            rules={[{ required: true, message: "Please number of manual day off per year!" }]}
          >
            <InputNumber
              min={1}
              max={100}
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
