import React, { useEffect } from "react";

import { Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import LevelApis from "../modules/level/apis/LevelApis";
import { CreateModal, DeleteModal, EditModal } from "../modules/level/components";
import { LevelModel } from "../modules/level/models";

type DataType = {
  key: number;
} & LevelModel;

const { Search } = Input;

export const Level: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Level name",
      dataIndex: "LevelName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.LevelName.localeCompare(b.LevelName),
    },
    {
      render: (_, record) => (
        <Space size="middle">
          <EditModal
            data={record}
            successCallback={fetchLevels}
          />
          <DeleteModal
            data={record}
            successCallback={successCallback}
          />
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
    LevelApis.getAll()
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
          placeholder="Search position"
          style={{
            width: 400,
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
    </>
  );
};
