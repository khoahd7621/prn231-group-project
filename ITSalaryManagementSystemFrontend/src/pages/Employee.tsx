import React, { useEffect } from "react";

import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { EmployeeStatus, EmployeeType } from "../constants/enum";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import {
  CreateModal,
  DeleteModal,
  DetailModal,
  EditModal,
  EmployeeStatusTag,
  RenderAvatar,
} from "../modules/employee/components";
import { EmployeeModel } from "../modules/employee/models";

type DataType = {
  key: number;
} & EmployeeModel;

const { Search } = Input;

export const Employee: React.FC = () => {
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
      title: "Company Join Date",
      dataIndex: "CreatedDate",
      render: (value: string, record: DataType) => (
        <div style={{ cursor: "pointer" }} onClick={() => setCurrent(record)}>
          {new Date(value).toLocaleString()}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime(),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (value: EmployeeStatus) => <EmployeeStatusTag status={value} />,
    },
    {
      width: "2rem",
      render: (_, record: DataType) => (
        <Space>
          <EditModal data={record} successCallback={fetchLevels} />
          <Button
            type="primary"
            style={{
              backgroundColor: "#2D4356",
            }}
          >
            Deactive
          </Button>
          <DeleteModal data={record} successCallback={fetchLevels} />
        </Space>
      ),
    },
  ];

  const [limit, setLimit] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [positions, setPositions] = React.useState<DataType[]>([]);
  const [current, setCurrent] = React.useState<DataType | null>(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = () => {
    setLoading(true);
    EmployeeApis.getAll()
      .then((res) => {
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchLevels();
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
          placeholder="Search by staff code, full name"
          style={{
            width: 400,
            margin: "auto",
          }}
          allowClear
        />

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
      <DetailModal data={current} setData={setCurrent} />
    </>
  );
};
