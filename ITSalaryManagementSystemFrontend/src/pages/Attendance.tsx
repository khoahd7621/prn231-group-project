import { Button, Input, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect } from "react";

//import { CreateModal, DeleteModal, EditModal } from "../modules/attendance/components";
import dayjs from "dayjs";
import { AttendanceStatus, AttendanceType } from "../constants/enum";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import {
  AttendanceStatusTag,
  CreateModal,
  DeleteModal,
  DetailModal,
  EditModal,
} from "../modules/attendance/components";
import { AttendanceModel } from "../modules/attendance/models";

type DataType = {
  key: number;
} & AttendanceModel;

const { Search } = Input;

export const Attendance: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Employee Name",
      key: "dob",
      dataIndex: ["User", "EmployeeName"],
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeId - b.EmployeeId,
      render: (value: string, record: DataType) => (
        <div>
          {(record.User as any).EmployeeCode} - {value}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "Date",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const dateA = new Date(a.Date.toString());
        const dateB = new Date(b.Date.toString());
        return dateA.getTime() - dateB.getTime();
      },
      render: (value: string, record: DataType) => (
        <div>{dayjs(value).format("YYYY-MM-DD ")}</div>
      ),
    },
    {
      title: "Hour",
      dataIndex: "Hour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Hour - b.Hour,
      render: (value: string, record: DataType) => <div>{value}</div>,
    },
    {
      title: "OTHour",
      dataIndex: "OTHour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.OTHour - b.OTHour,
      render: (value: string, record: DataType) => <div>{value}</div>,
    },
    {
      title: "Status",
      dataIndex: "Status",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Status - b.Status,
      render: (value: AttendanceStatus, record: DataType) => (
        <div>
          <AttendanceStatusTag status={value} />
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "Type",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type - b.Type,
      render: (value: AttendanceType, record: DataType) => {
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
      width: "20px",
      render: (_, record) => (
        <Space>
          <Button style={{ backgroundColor: "#00cc00", color: "white" }}>
            Aprrove
          </Button>
          <Button danger>Reject</Button>
          <EditModal data={record} successCallback={fetchAttendances} />
          <DeleteModal
            data={record}
            isDisable={false}
            // {record.Status.toString() != AttendanceStatus[0]}
            successCallback={successCallback}
          />
        </Space>
      ),
    },
  ];

  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [current, setCurrent] = React.useState<DataType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [attendances, setAttendances] = React.useState<DataType[]>([]);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = () => {
    setLoading(true);
    AttendanceApis.getAll()
      .then((res) => {
        setAttendances(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchAttendances();
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
        <Search
          placeholder="Search level"
          style={{
            width: 400,
          }}
          allowClear
        />
        <CreateModal successCallback={successCallback} />
      </div>
      <Table
        columns={columns}
        dataSource={attendances}
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
      <DetailModal data={current} setData={setCurrent} />
    </>
  );
};
