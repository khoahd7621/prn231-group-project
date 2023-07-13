/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import React, { useEffect } from "react";

import { Button, DatePicker, Input, Space, Table, Tag, notification } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AttendanceStatus, AttendanceType } from "../constants/enum";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import { AttendanceStatusTag, CreateModal, DeleteModal, EditModal } from "../modules/attendance/components";
import { AttendanceModel } from "../modules/attendance/models";
import { SearchOutlined } from "@ant-design/icons";

type DataType = {
  key: number;
} & AttendanceModel;
type NotificationType = "success" | "info" | "warning" | "error";
export const Attendance: React.FC = () => {
  const pageSizeOptions = [5, 10, 20, 50];

  const columns: ColumnsType<DataType> = [
    {
      title: "Employee Name",
      key: "dob",
      dataIndex: ["User", "EmployeeName"],
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeId - b.EmployeeId,
      filterMultiple: false,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{ padding: 8 }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={clearFilters}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
      onFilter: (value, record) =>
        (record.User as any).EmployeeName.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      render: (value: string, record: DataType) => (
        <div>
          {(record.User as any).EmployeeCode} - {value}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "Date",
      filterMultiple: false,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{ padding: 10 }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <RangePicker
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e ? [e] : []);
            }}
            onPressEnter={() => confirm}
            style={{ marginBottom: 10, display: "flex" }}
          />

          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
      onFilter: (value, record) => {
        const recordDate = dayjs(record.Date);
        const startDate = value[0];
        const endDate = value[1];
        return startDate && endDate
          ? (recordDate.isAfter(startDate, "day") || recordDate.isSame(startDate, "day")) &&
              (recordDate.isBefore(endDate, "day") || recordDate.isSame(startDate, "day"))
          : true;
      },
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const dateA = new Date(a.Date.toString());
        const dateB = new Date(b.Date.toString());
        return dateA.getTime() - dateB.getTime();
      },
      render: (value: string) => <div>{dayjs(value).format("YYYY-MM-DD ")}</div>,
    },
    {
      title: "Hour",
      dataIndex: "Hour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Hour - b.Hour,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: "OTHour",
      dataIndex: "OTHour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.OTHour - b.OTHour,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: "Status",
      dataIndex: "Status",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Status - b.Status,
      filters: [
        {
          text: AttendanceStatus[0],
          value: AttendanceStatus[0],
        },
        {
          text: AttendanceStatus[1],
          value: AttendanceStatus[1],
        },
        {
          text: AttendanceStatus[2],
          value: AttendanceStatus[2],
        },
      ],
      filterMode: "tree",
      onFilter: (value: any, record) => record.Status.toString() === value.toString(),
      render: (value: AttendanceStatus) => (
        <div>
          <AttendanceStatusTag status={value} />
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "Type",
      filters: [
        {
          text: AttendanceType[0],
          value: AttendanceType.Offline.toString(),
        },
        {
          text: AttendanceType[1],
          value: AttendanceType.Online.toString(),
        },
      ],
      filterMode: "tree",
      onFilter: (value: any, record) => record.Type == parseInt(value),
      sorter: (a, b) => a.Type - b.Type,
      sortDirections: ["descend", "ascend"],
      render: (value: AttendanceType) => {
        switch (value) {
          case AttendanceType.Online.valueOf():
            return (
              <div>
                <Tag color="success">{AttendanceType[value]} </Tag>
              </div>
            );
          case AttendanceType.Offline.valueOf():
            return (
              <div>
                <Tag color="default">{AttendanceType[value]} </Tag>
              </div>
            );
        }
      },
    },
    {
      key: "action",
      width: "350px",
      render: (_, record) => {
        switch (record.Status.valueOf()) {
          case (AttendanceStatus[0] as any).valueOf():
            return (
              <Space>
                <Button
                  style={{ backgroundColor: "#00cc00", color: "white" }}
                  onClick={() => handleApprove(record.Id)}
                >
                  Aprrove
                </Button>
                <Button
                  danger
                  onClick={() => handleReject(record.Id)}
                >
                  Reject
                </Button>
                <EditModal
                  data={record}
                  successCallback={fetchAttendances}
                />
                <DeleteModal
                  data={record}
                  successCallback={successCallback}
                />
              </Space>
            );
          case (AttendanceStatus[1] as any).valueOf():
            return <Space></Space>;
          case (AttendanceStatus[2] as any).valueOf():
            return (
              <Space>
                <DeleteModal
                  data={record}
                  successCallback={successCallback}
                />
              </Space>
            );
        }
      },
    },
  ];
  const [loading, setLoading] = React.useState<boolean>(true);
  const [attendances, setAttendances] = React.useState<DataType[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: string, description: string) => {
    api[type]({
      message: message,
      description: description,
      duration: 1,
    });
  };
  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = () => {
    setLoading(true);
    AttendanceApis.getAll()
      .then((res) => {
        setAttendances(res.value.map((item) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  const successCallback = () => {
    fetchAttendances();
  };

  const handleApprove = (id: number) => {
    AttendanceApis.patch(id, AttendanceStatus.Approved.valueOf())
      .then(() => {
        fetchAttendances();
        openNotificationWithIcon("success", "Approve", "Approve attendance success");
      })
      .catch((err) => {
        console.error(err);
        openNotificationWithIcon("error", "Approve", err?.response?.data?.error?.message);
      });
  };

  const handleReject = (id: number) => {
    AttendanceApis.patch(id, AttendanceStatus.Rejected.valueOf())
      .then(() => {
        openNotificationWithIcon("success", "Reject", "Reject attendance success");
        fetchAttendances();
      })
      .catch((err) => {
        console.error(err);
        openNotificationWithIcon("error", "Reject", err.response.data.message);
      });
  };
  const { RangePicker } = DatePicker;
  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <CreateModal
          isEmp={false}
          successCallback={successCallback}
        />
      </div>
      <Table
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={attendances}
        loading={loading}
        pagination={{
          pageSizeOptions,
          showSizeChanger: true,
        }}
      />
    </>
  );
};
