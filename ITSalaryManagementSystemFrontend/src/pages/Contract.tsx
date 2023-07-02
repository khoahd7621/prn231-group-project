import dayjs from "dayjs";
import React, { useEffect } from "react";

import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { EmployeeType } from "../constants/enum";
import ContractApis from "../modules/contract/apis/ContractApis";
import { CreateModal } from "../modules/contract/components";
import { ContractModel } from "../modules/contract/models";

type DataType = {
  key: number;
} & ContractModel;

const { Search } = Input;

export const Contract: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Staff Code",
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      render: (value: string) => new Date(value).toLocaleDateString(),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.StartDate).unix() - dayjs(b.StartDate).unix(),
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      render: (value: string) => new Date(value).toLocaleDateString(),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.StartDate).unix() - dayjs(b.StartDate).unix(),
    },
    {
      title: "Employee Type",
      dataIndex: "EmployeeType",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeType.toString().localeCompare(b.EmployeeType.toString()),
      render: (value: string) => {
        switch (EmployeeType[value as keyof typeof EmployeeType]) {
          case EmployeeType.FullTime:
            return "Full-time";
          case EmployeeType.PartTime:
            return "Part-time";
          default:
            return "Not Available";
        }
      },
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
    {
      width: "2rem",
      render: () => (
        <Space>
          <Button type="primary">Edit</Button>
          <Button
            type="primary"
            style={{
              backgroundColor: "#52c41a",
            }}
          >
            Activate
          </Button>
          <Button
            type="primary"
            danger
          >
            Deactivate
          </Button>
          <Button
            type="primary"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const [limit, setLimit] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [contracts, setContracts] = React.useState<DataType[]>([]);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = () => {
    setLoading(true);
    ContractApis.getAll()
      .then((res) => {
        setContracts(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchContracts();
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
          placeholder="Search by staff code"
          style={{
            width: 400,
          }}
          allowClear
        />

        <CreateModal successCallback={successCallback} />
      </div>
      <Table
        columns={columns}
        dataSource={contracts}
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
