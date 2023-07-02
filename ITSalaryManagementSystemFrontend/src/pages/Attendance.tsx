import React, { useEffect } from "react";
import { Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

//import { CreateModal, DeleteModal, EditModal } from "../modules/attendance/components";
import {
  CreateModal,
  DeleteModal,
  DetailModal,
  EditModal,
  ModifierStatusModal,
} from "../modules/attendance/components";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import { AttendanceModel } from "../modules/attendance/models";
import { AttendanceStatus, AttendanceType } from "../constants/enum";
import { AttendanceStatusTag } from "../modules/attendance/components";
import dayjs, { Dayjs } from "dayjs";

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
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setCurrent(record);
            console.log(record);
          }}
        >
          {value}
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
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {dayjs(value).format("HH:mm | YYYY-MM-DD ")}
        </div>
      ),
    },
    {
      title: "Hour",
      dataIndex: "Hour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Hour - b.Hour,
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {value}
        </div>
      ),
    },
    {
      title: "OTHour",
      dataIndex: "OTHour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.OTHour - b.OTHour,
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {value}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Status - b.Status,
      render: (value: AttendanceStatus, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          <AttendanceStatusTag status={value} />
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "Type",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type - b.Type,
      render: (value: AttendanceType, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {AttendanceType[value]}
        </div>
      ),
    },
    {
      width: "20px",
      render: (_, record) => (
        <Space>
          <ModifierStatusModal
            data={record}
            successCallback={successCallback}
          />
          <EditModal data={record} successCallback={fetchAttendances} />
          <DeleteModal
            data={record}
            isDisable={record.Status.toString() == AttendanceStatus[0]}
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
