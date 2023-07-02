import dayjs from "dayjs";
import { useEffect, useState } from "react";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import {
  AttendanceType,
  EmployeeStatus,
  EmployeeType,
} from "../../../constants/enum";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import { EmployeeStatusTag, RenderAvatar } from "../../employee/components";
import { EmployeeModel } from "../../employee/models";
import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceModel, AttendancePutForm } from "../models";

type Props = {
  data: AttendanceModel;
  successCallback?: () => void;
};
type DataType = {
  key: number;
} & EmployeeModel;

export const EditModal = ({ data, successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [widthModal, setWidthModal] = useState<number>(500); // need change to x2 //max is 80%
  const [showTblSelectEmployee, setShowTblSelectEmployee] =
    useState<boolean>(true);
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<DataType[]>([]);
  const [current, setCurrent] = useState<DataType | null>(null);
  const { Search } = Input;

  useEffect(() => {
    fetchEmployee();
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
    setShowTblSelectEmployee(true);
    setWidthModal(500);
    setIsModalOpen(true);
  };

  const handleSubmit = (value: AttendancePutForm) => {
    setSending(true);
    console.log(value);
    AttendanceApis.put(data.Id, { ...value, date: value.date.toISOString() })
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong! Please refresh page and try again later.");
      })
      .finally(() => setSending(false));
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleShowTableSelectEmployee = () => {
    setShowTblSelectEmployee(false);
    setWidthModal(1300);
  };
  const fetchEmployee = () => {
    setLoading(true);
    EmployeeApis.getAll()
      .then((res) => {
        setEmployees(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };
  const columns: ColumnsType<DataType> = [
    {
      width: "1rem",
      render: (_, record: DataType) => (
        <RenderAvatar gender={record.Gender} width={30} preview={false} />
      ),
    },
    {
      title: "Staff Code",
      dataIndex: "EmployeeCode",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeCode.localeCompare(b.EmployeeCode),
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {value}
        </div>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "EmployeeName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeName.localeCompare(b.EmployeeName),
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {value}
        </div>
      ),
    },
    {
      title: "Job Title",
      dataIndex: "JobTitle",
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {value || " Not Available"}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: {
        compare: () => 0,
      },
    },
    {
      title: "Employee Type",
      dataIndex: "EmployeeType",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.EmployeeType.toString().localeCompare(b.EmployeeType.toString()),
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {EmployeeType[value as keyof typeof EmployeeType] ===
          EmployeeType.FullTime
            ? "Full-time"
            : EmployeeType[value as keyof typeof EmployeeType] ===
              EmployeeType.PartTime
            ? "Part-time"
            : "Not Available"}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (value: EmployeeStatus) => <EmployeeStatusTag status={value} />,
    },
  ];
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit
      </Button>
      <Modal
        title={`Edit Attendance ${(data.User as any).EmployeeCode} - ${
          (data.User as any).EmployeeName
        }`}
        open={isModalOpen}
        footer={null}
        cancelButtonProps={{
          disabled: sending,
        }}
        onCancel={handleCancel}
        width={widthModal}
        // style={{width:'fit-content'}}
      >
        <div style={{ display: "flex" }}>
          <div style={{ margin: "auto" }}>
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
                <div style={{ display: "flex" }}>
                  <Input value={(data.User as any).EmployeeName} disabled />
                  <Button
                    style={{ marginLeft: "5px" }}
                    type="primary"
                    onClick={() => handleShowTableSelectEmployee()}
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                </div>
              </Form.Item>
              <Form.Item
                label="Date of work"
                name="date"
                rules={[
                  { required: true, message: "Please input date of work!" },
                ]}
              >
                <DatePicker
                  placeholder="Select date of work"
                  format="YYYY-MM-DD HH:mm"
                  style={{
                    width: "100%",
                  }}
                  showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
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
                        value:
                          AttendanceType[key as keyof typeof AttendanceType],
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
          </div>
          <div style={{ margin: "auto" }} hidden={showTblSelectEmployee}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Search
                placeholder="Search by staff code, full name"
                style={{
                  width: 400,
                }}
                allowClear
              />
            </div>
            <Table
              columns={columns}
              dataSource={employees}
              loading={loading}
              rowSelection={{
                type: "radio",
                // ...rowSelection,
              }}
              pagination={{
                current: page,
                pageSize: limit,
                total: total,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setLimit(pageSize || 5);
                },
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
