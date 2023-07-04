import React, { useEffect } from "react";
import { RangeValue } from "rc-picker/lib/interface";
import {
  DeleteOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeaveStatus, LeaveType } from "../constants/enum";
import LeaveApis from "../modules/leave/apis/LeaveApis";
import { CreateModal, LeaveStatusTag } from "../modules/leave/components";
import { LeaveModel } from "../modules/leave/models/LeaveModel";
import { useAppSelector } from "../reduxs/hooks";
import { Dayjs } from "dayjs";
type DataType = {
  key: number;
} & LeaveModel;

export const EmpLeave: React.FC = () => {
  const handleConfirmDelete = async (id: number) => {
    try {
      setSending(true);
      await LeaveApis.delete(id);
      message.success("Leave deleted successfully");
      fetchLeave();
    } catch (error: any) {
      console.error("Error leave delete request:", error);
      message.error(
        `Error deleting leave:  ${
          error.response?.data?.error?.message || "An error occurred."
        }`
      );
    } finally {
      setSending(false);
    }
  };
  const handleCancel = () => {
    if (sending) return;
  };
  const handleSearch = async () => {
    const filters: string[] = [];
    filters.push(`EmployeeId eq ${profileState?.user?.id}`);
    if (selectedDateRange) {
      filters.push(
        `StartDate le ${selectedDateRange[1]
          ?.toISOString()
          .slice(0, 10)} and EndDate ge ${selectedDateRange[0]
          ?.toISOString()
          .slice(0, 10)}`
      );
    }
    if (selectedType || selectedType === 0) {
      filters.push(`Type eq '${LeaveType[selectedType]}'`);
    }
    if (selectedStatus) {
      filters.push(`Status eq '${LeaveStatus[selectedStatus]}'`);
    }
    // Join the filter expressions with 'and' operator
    setQuery(`?$filter=${filters.join(" and ")}`);
    console.log(query);
    fetchLeave();
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Leave Days",
      dataIndex: "LeaveDays",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.LeaveDays.toString().localeCompare(b.LeaveDays.toString()),
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      render: (value: string) => new Date(value).toISOString().slice(0, 10),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      render: (value: string) => new Date(value).toISOString().slice(0, 10),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime(),
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
        if (
          record.Status === LeaveStatus[LeaveStatus.REJECTED] ||
          record.Status === LeaveStatus[LeaveStatus.WAITING]
        ) {
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
                <Button type="primary" danger>
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
  const profileState = useAppSelector((state) => state.profile);
  const [form] = Form.useForm();
  const [selectedDateRange, setSelectedDateRange] = React.useState<
    RangeValue<Dayjs> | undefined
  >(undefined);
  const [selectedType, setSelectedType] = React.useState<number | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = React.useState<
    number | undefined
  >(undefined);
  const [query, setQuery] = React.useState<string>(
    `?$filter=EmployeeId eq ${profileState?.user?.id}`
  );

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

  const fetchLeave = () => {
    setLoading(true);
    LeaveApis.getAllByEmployeeId(query)
      .then((res) => {
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    fetchLeave();
  }, []);

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
        <Form
          style={{ width: "100%" }}
          autoComplete="off"
          disabled={sending}
          form={form}
        >
          <Space.Compact block>
            <Form.Item noStyle name={"rangepicker"}>
              <DatePicker.RangePicker
                style={{ width: "20%" }}
                onChange={setSelectedDateRange}
              />
            </Form.Item>
            <Form.Item noStyle name={"type"}>
              <Select
                style={{ width: "15%" }}
                placeholder={"ALL TYPE"}
                onChange={setSelectedType}
                options={[{ value: "", label: "ALL TYPE" }, ...typeOptions]}
              />
            </Form.Item>
            <Form.Item noStyle name={"status"}>
              <Select
                style={{ width: "15%" }}
                placeholder={"ALL STATUS"}
                onChange={setSelectedStatus}
                options={[{ value: "", label: "ALL STATUS" }, ...statusOptions]}
              />
            </Form.Item>
            <Form.Item noStyle>
              <Button
                onClick={() => {
                  form.resetFields();
                  setSelectedDateRange(undefined);
                  setSelectedStatus(undefined);
                  setSelectedType(undefined);
                }}
                icon={<DeleteOutlined />}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={sending}
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
