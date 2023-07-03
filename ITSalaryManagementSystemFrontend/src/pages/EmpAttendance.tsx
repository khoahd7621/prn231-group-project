import dayjs from "dayjs";
import React, { useEffect } from "react";

import { Input, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AttendanceStatus, AttendanceType } from "../constants/enum";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import {
  AttendanceStatusTag,
  CreateModal,
  DeleteModal,
  EditModal,
} from "../modules/attendance/components";
import { AttendanceModel } from "../modules/attendance/models";

type DataType = {
  key: number;
} & AttendanceModel;

const { Search } = Input;

export const EmpAttendance: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "Date",
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
      render: (value: AttendanceStatus) => (
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
      width: "20px",
      render: (_, record) => {
        switch (record.Status.valueOf()) {
          case (AttendanceStatus[0] as any).valueOf():
            return (
              <Space>
                <EditModal data={record} successCallback={fetchAttendances} />
                <DeleteModal data={record} isDisable={false} successCallback={successCallback} />
              </Space>
            );
          case (AttendanceStatus[2] as any).valueOf():
            return (
              <Space>
                <DeleteModal data={record} isDisable={false} successCallback={successCallback} />
              </Space>
            );
        }
      },
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
        }}>
        <Search
          placeholder="Search level"
          style={{
            width: 400,
          }}
          allowClear
        />
        <CreateModal isEmp={true} successCallback={successCallback} />
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
    </>
  );
};