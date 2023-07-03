import React, { useEffect } from "react";

import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Popconfirm, Select, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaveStatus } from "../constants/enum";
import LeaveApis from "../modules/leave/apis/LeaveApis";
import { CreateModal, LeaveStatusTag } from "../modules/leave/components";
import { LeaveModel } from "../modules/leave/models/LeaveModel";
const { Search } = Input;
type DataType = {
  key: number;
} & LeaveModel;

export const Leave: React.FC = () => {
  const handleConfirm = async (id: number, status: string) => {
    try {
      setSending(true);
      await LeaveApis.patch(id, { status: status });
      message.success("Leave status updated successfully");
      fetchLeave();
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
      fetchLeave();
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
      render: (value: string) => value.toUpperCase().split('_').join(' '),
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
                onCancel={handleCancel} icon={<QuestionCircleOutlined style={{ color: '#389e0d' }} />}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#389e0d"
                  }}>
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
                icon={<QuestionCircleOutlined style={{ color: '#2D4356' }} />}
              >
                <Button type="primary"
                  style={{
                    backgroundColor: "#2D4356",
                  }}>
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
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <Button type="primary"
                  danger>
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
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <Button type="primary"
                  danger>
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
  const statusOptions = Object.keys(LeaveStatus)
    .filter((v) => isNaN(Number(v)))
    .map((key) => {
      return {
        value: LeaveStatus[key as keyof typeof LeaveStatus],
        label: key.toUpperCase().split('_').join(' '),
      };
    });

  useEffect(() => {
    fetchLeave();
  }, []);

  const fetchLeave = () => {
    setLoading(true);
    LeaveApis.getAll()
      .then((res) => {
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchLeave();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space.Compact block>
          <Input style={{ width: '30%' }} placeholder="Search by employee code, full name" allowClear />
          <DatePicker.RangePicker style={{ width: '30%' }} />
          <Select style={{ width: '20%' }}
            placeholder={"ALL STATUS"}
            options={[
              { value: '', label: 'ALL STATUS' },
              ...statusOptions,
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </Space.Compact>
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
