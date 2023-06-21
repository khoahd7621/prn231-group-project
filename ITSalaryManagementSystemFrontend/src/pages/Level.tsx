import React, { useEffect } from "react";

import { Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { CreateModal, DeleteModal, EditModal } from "../modules/level/components";
import { LevelModel } from "../modules/level/models";

type DataType = {
  key: number;
} & LevelModel;

const columns: ColumnsType<DataType> = [
  {
    title: "Level name",
    dataIndex: "levelName",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.levelName.localeCompare(b.levelName),
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
    levelName: "Intern",
  },
  {
    key: 2,
    id: 2,
    levelName: "Fresher",
  },
  {
    key: 3,
    id: 3,
    levelName: "Junior",
  },
  {
    key: 4,
    id: 4,
    levelName: "Senior",
  },
  {
    key: 5,
    id: 5,
    levelName: "Leader",
  },
];

const { Search } = Input;

export const Level: React.FC = () => {
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
