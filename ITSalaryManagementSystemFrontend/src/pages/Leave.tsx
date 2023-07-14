import { Dayjs } from "dayjs";
import React, { useEffect } from "react";

import { DeleteOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Popconfirm, Select, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RangeValue } from "rc-picker/lib/interface";

import { LeaveStatus, LeaveType, Role } from "../constants/enum";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import LeaveApis from "../modules/leave/apis/LeaveApis";
import { CreateModal, LeaveStatusTag } from "../modules/leave/components";
import { LeaveModel } from "../modules/leave/models/LeaveModel";

type DataType = {
  key: number;
} & LeaveModel;

type OptionItem = {
  value: number;
  label: string;
};

export const Leave: React.FC = () => {
  const handleConfirm = async (id: number, status: string) => {
    try {
      setSending(true);
      await LeaveApis.patch(id, { status: status });
      message.success("Leave status updated successfully");
      fetchLeave(query);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error leave patch request:", error);
      message.error(`Error updating leave:  ${error.response?.data?.error?.message || "An error occurred."}`);
    } finally {
      setSending(false);
    }
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      setSending(true);
      await LeaveApis.delete(id);
      message.success("Leave deleted successfully");
      fetchLeave(query);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error leave delete request:", error);
      message.error(`Error deleting leave:  ${error.response?.data?.error?.message || "An error occurred."}`);
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    if (sending) return;
  };

  const handleSearch = async () => {
    const filters: string[] = [];
    if (selectedEmployee) {
      filters.push(`EmployeeId eq ${selectedEmployee}`);
    }
    if (selectedDateRange) {
      filters.push(
        `StartDate le ${selectedDateRange[1]?.toISOString().slice(0, 10)} and EndDate ge ${selectedDateRange[0]
          ?.toISOString()
          .slice(0, 10)}`
      );
    }
    if (selectedType && selectedType !== -1) {
      filters.push(`Type eq '${LeaveType[selectedType]}'`);
    }
    if (selectedStatus && selectedStatus !== -1) {
      filters.push(`Status eq '${LeaveStatus[selectedStatus]}'`);
    }
    // Join the filter expressions with 'and' operator
    if (filters.length > 0) {
      const tmpQuery = `&$filter=${filters.join(" and ")}`;
      setQuery(tmpQuery);
    }else{
      setQuery("");
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Employee",
      dataIndex: "User",
      render: (user) => `${user?.EmployeeCode} - ${user?.EmployeeName}`,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.User.EmployeeCode.localeCompare(b.User.EmployeeCode),
    },
    {
      title: "Leave Days",
      dataIndex: "LeaveDays",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.LeaveDays.toString().localeCompare(b.LeaveDays.toString()),
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      render: (value: string) => new Date(value).toISOString().slice(0, 10),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      render: (value: string) => new Date(value).toISOString().slice(0, 10),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime(),
    },
    {
      title: "Type",
      dataIndex: "Type",
      render: (value: string) => value.toUpperCase().split("_").join(" "),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type.toString().localeCompare(b.Type.toString()),
    },
    {
      title: "Reason",
      dataIndex: "Reason",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Reason.localeCompare(b.Reason),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (value: LeaveStatus) => <LeaveStatusTag status={value} />,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Status.toString().localeCompare(b.Status.toString()),
    },
    {
      title: "Action",
      width: "2rem",
      render: (record) => {
        if (record.Status === LeaveStatus[LeaveStatus.WAITING]) {
          return (
            <Space>
              <Popconfirm
                title="Approve the leave"
                placement="leftTop"
                description="Are you sure to approve this leave?"
                onConfirm={() => handleConfirm(record.key, LeaveStatus.APPROVED.toString())}
                cancelButtonProps={{
                  disabled: sending,
                }}
                disabled={sending}
                onCancel={handleCancel}
                icon={<QuestionCircleOutlined style={{ color: "#389e0d" }} />}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#389e0d",
                  }}
                >
                  Approve
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Reject the leave"
                placement="leftTop"
                description="Are you sure to reject this leave?"
                onConfirm={() => handleConfirm(record.key, LeaveStatus.REJECTED.toString())}
                cancelButtonProps={{
                  disabled: sending,
                }}
                disabled={sending}
                onCancel={handleCancel}
                icon={<QuestionCircleOutlined style={{ color: "#2D4356" }} />}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#2D4356",
                  }}
                >
                  Reject
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Delete the leave"
                placement="leftTop"
                description="Are you sure to delete this leave?"
                onConfirm={() => handleConfirmDelete(record.key)}
                cancelButtonProps={{
                  disabled: sending,
                }}
                disabled={sending}
                onCancel={handleCancel}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button
                  type="primary"
                  danger
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        if (record.Status === LeaveStatus[LeaveStatus.REJECTED]) {
          return (
            <Space>
              <Popconfirm
                title="Delete the leave"
                placement="leftTop"
                description="Are you sure to delete this leave?"
                onConfirm={() => handleConfirmDelete(record.key)}
                cancelButtonProps={{
                  disabled: sending,
                }}
                disabled={sending}
                onCancel={handleCancel}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button
                  type="primary"
                  danger
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        return null; // Empty cell for other statuses
      },
    },
  ];

  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [positions, setPositions] = React.useState<DataType[]>([]);
  const [sending, setSending] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<OptionItem[]>([]);
  const [selectedEmployee, setSelectedEmployee] = React.useState<string | undefined>(undefined);
  const [selectedDateRange, setSelectedDateRange] = React.useState<RangeValue<Dayjs> | undefined>(undefined);
  const [selectedType, setSelectedType] = React.useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = React.useState<number | undefined>(undefined);
  const [query, setQuery] = React.useState<string | "">("");
  const [form] = Form.useForm();
  const statusOptions = Object.keys(LeaveStatus)
    .filter((v) => isNaN(Number(v)))
    .map((key) => {
      return {
        value: LeaveStatus[key as keyof typeof LeaveStatus],
        label: key.toUpperCase().split("_").join(" "),
      };
    });
  const typeOptions = Object.keys(LeaveType)
    .filter((v) => isNaN(Number(v)))
    .map((key) => {
      return {
        value: LeaveType[key as keyof typeof LeaveType],
        label: key.toUpperCase().split("_").join(" "),
      };
    });

  useEffect(() => {
    fetchLeave(query);
  }, [query]);

  useEffect(() => {
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
  }, []);

  const fetchLeave = (query: string) => {
    setLoading(true);
    LeaveApis.getAll(query)
      .then((res) => {
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchLeave(query);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <Form
          style={{ width: "100%" }}
          autoComplete="off"
          disabled={sending}
          form={form}
        >
          <Space.Compact block>
            <Form.Item
              noStyle
              name={"employeeid"}
            >
              <Select
                style={{ width: "20%" }}
                showSearch
                allowClear
                placeholder="Select a employee"
                onChange={setSelectedEmployee}
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
              noStyle
              name={"rangepicker"}
            >
              <DatePicker.RangePicker
                style={{ width: "20%" }}
                onChange={setSelectedDateRange}
              />
            </Form.Item>
            <Form.Item
              noStyle
              name={"type"}
              initialValue={-1}
            >
              <Select
                style={{ width: "15%" }}
                onChange={setSelectedType}
                options={[{ value: -1, label: "ALL TYPE" }, ...typeOptions]}
              />
            </Form.Item>
            <Form.Item
              noStyle
              name={"status"}
              initialValue={-1}
            >
              <Select
                style={{ width: "15%" }}
                onChange={setSelectedStatus}
                options={[{ value: -1, label: "ALL STATUS" }, ...statusOptions]}
              />
            </Form.Item>

            <Form.Item noStyle>
              {query && (
                <Button
                  onClick={() => {
                    form.resetFields();
                    setQuery("");
                    setSelectedDateRange(undefined);
                    setSelectedStatus(undefined);
                    setSelectedType(undefined);
                    setSelectedEmployee(undefined);
                  }}
                  icon={<DeleteOutlined />}
                  style={{
                    borderRadius: 0,
                  }}
                />
              )}
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Form.Item>
          </Space.Compact>
        </Form>
        <CreateModal successCallback={successCallback} />
      </div>
      <Table
        columns={columns}
        dataSource={positions}
        loading={loading}
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
    </>
  );
};
