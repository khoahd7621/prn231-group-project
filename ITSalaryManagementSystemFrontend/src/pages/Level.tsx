import React, { useEffect } from "react";

import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import LevelApis from "../modules/level/apis/LevelApis";
import { CreateModal, DeleteModal, EditModal } from "../modules/level/components";
import { LevelModel } from "../modules/level/models";

type DataType = {
  key: number;
} & LevelModel;

export const Level: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Level name",
      dataIndex: "LevelName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.LevelName.localeCompare(b.LevelName),
    },
    {
      width: "20px",
      render: (_, record) => (
        <Space>
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

  const [page, setPage] = React.useState<number>(1);
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
      })
      .catch((err) => console.error(err));
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
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <CreateModal successCallback={successCallback} />
      </div>
      <Table
        columns={columns}
        dataSource={positions}
        loading={loading}
        pagination={{
          current: page,
          defaultPageSize: 10,
          pageSizeOptions: ["10", "20", "50"],
          showSizeChanger: true,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </>
  );
};
