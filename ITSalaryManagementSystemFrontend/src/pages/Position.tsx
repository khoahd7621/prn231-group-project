import React, { useEffect } from "react";

import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import PositionApis from "../modules/position/apis/PositionApis";
import { CreateModal, DeleteModal, EditModal } from "../modules/position/components";
import { PositionModel } from "../modules/position/models";

type DataType = {
  key: number;
} & PositionModel;

export const Position: React.FC = () => {
  const [page, setPage] = React.useState<number>(1);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [positions, setPositions] = React.useState<DataType[]>([]);

  useEffect(() => {
    fetchPositions();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Position name",
      dataIndex: "PositionName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.PositionName.localeCompare(b.PositionName),
    },
    {
      width: "20px",
      render: (_, record) => (
        <Space>
          <EditModal
            data={record}
            successCallback={fetchPositions}
          />
          <DeleteModal
            data={record}
            successCallback={successCallback}
          />
        </Space>
      ),
    },
  ];

  const fetchPositions = () => {
    setLoading(true);
    PositionApis.getAll()
      .then((res) => {
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchPositions();
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
