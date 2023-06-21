import React, { useEffect } from "react";

import { Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { CreateModal, DeleteModal, EditModal } from "../modules/position/components";
import { PositionModel } from "../modules/position/models";

type DataType = {
  key: number;
} & PositionModel;

const columns: ColumnsType<DataType> = [
  {
    title: "Position name",
    dataIndex: "positionName",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.positionName.localeCompare(b.positionName),
  },
  {
    render: (_, record) => (
      <Space size="middle">
        <EditModal data={record} />
        <DeleteModal data={record} />
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: 1,
    id: 1,
    positionName: "Software Engineer",
  },
  {
    key: 2,
    id: 2,
    positionName: "Senior Software Engineer",
  },
  {
    key: 3,
    id: 3,
    positionName: "Team Lead",
  },
  {
    key: 4,
    id: 4,
    positionName: "Project Manager",
  },
  {
    key: 5,
    id: 5,
    positionName: "Technical Lead",
  },
  {
    key: 6,
    id: 6,
    positionName: "Technical Architect",
  },
  {
    key: 7,
    id: 7,
    positionName: "Solution Architect",
  },
  {
    key: 8,
    id: 8,
    positionName: "Chief Technology Officer",
  },
];

const { Search } = Input;

export const Position: React.FC = () => {
  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [positions, setPositions] = React.useState<DataType[]>([]);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    setPositions(data);
    setTotal(data.length);
    setLoading(false);
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
          placeholder="Search position"
          style={{
            width: 400,
          }}
          allowClear
        />

        <CreateModal />
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
