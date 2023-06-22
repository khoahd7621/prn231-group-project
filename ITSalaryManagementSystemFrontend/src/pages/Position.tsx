import React, { useEffect } from "react";

import { Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { CreateModal, DeleteModal, EditModal } from "../modules/position/components";
import { PositionModel } from "../modules/position/models";
import PositionApis from "../modules/position/apis/PositionApis";

type DataType = {
  key: number;
} & PositionModel;

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

  const columns: ColumnsType<DataType> = [
    {
      title: "Position name",
      dataIndex: "PositionName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.PositionName.localeCompare(b.PositionName),
    },
    {
      render: (_, record) => (
        <Space size="middle">
          <EditModal
            data={record}
            successCallback={successCallback}
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
        console.log("res: ", res);
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
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
