import dayjs from "dayjs";
import React, { useEffect } from "react";

import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { AttendanceStatus, AttendanceType } from "../constants/enum";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import { AttendanceStatusTag, CreateModal, DeleteModal, EditModal } from "../modules/attendance/components";
import { AttendanceModel } from "../modules/attendance/models";

type DataType = {
  key: number;
} & AttendanceModel;

const { RangePicker } = DatePicker;

export const EmpAttendance: React.FC = () => {
  const columns: ColumnsType<DataType> = [
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
      onFilter: (value, record) => record.Status.toString() === value.toString(),
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
      onFilter: (value, record) => record.Type == parseInt(value),
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
      width: "200px",
      render: (_, record) => {
        if (record.Status != AttendanceStatus[1].valueOf())
          return (
            <Space>
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
      },
    },
  ];

  const [loading, setLoading] = React.useState<boolean>(true);
  const [attendances, setAttendances] = React.useState<DataType[]>([]);
  const pageSizeOptions = [5, 10, 20, 50];
  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = () => {
    setLoading(true);
    AttendanceApis.getEmployee("?$expand=Attendances($expand=User)")
      .then((res) => {
        setAttendances(res.Attendances.map((item: { Id: any }) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  const successCallback = () => {
    fetchAttendances();
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <CreateModal
          isEmp={true}
          successCallback={successCallback}
        />
      </div>
      <Table
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
