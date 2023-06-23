import React, { useEffect } from "react";

import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import LeaveApis from "../modules/leave/apis/LeaveApis";
import { LeaveModel } from "../modules/leave/models/LeaveModel"; 
import { CreateModal } from "../modules/leave/components";

type DataType = {
  key: number;
} & LeaveModel;

export const Leave: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Employee Code",
      dataIndex: ['User', 'EmployeeCode'],
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.User.EmployeeCode.localeCompare(b.User.EmployeeCode),
    },
    {
      title: "Leave Date",
      dataIndex: "Date",
      render: (value: string) => new Date(value).toLocaleString(),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
    },
    {
      title: "Type",
      dataIndex: "Type",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type.localeCompare(b.Type),
    },
    {
      title: "Reason",
      dataIndex: "Reason",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type.localeCompare(b.Type),
    },
    {
      title: "Status",
      dataIndex: "Status",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type.localeCompare(b.Type),
    },
    {
      title: "Action",
      width: "2rem",
      render: () => (
        <Space>
          <Button type="primary">Edit</Button>
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

  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [positions, setPositions] = React.useState<DataType[]>([]);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = () => {
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
    fetchLevels();
  };

  return (
    <>
      <CreateModal successCallback={successCallback} />
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
