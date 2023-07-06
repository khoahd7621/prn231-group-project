import React, { useEffect } from "react";

import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ContractStatus, EmployeeStatus, Role } from "../constants/enum";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import {
  CreateModal,
  DeleteModal,
  DetailModal,
  EditModal,
  EmployeeStatusTag,
  EmployeeTypeTag,
  RenderAvatar,
} from "../modules/employee/components";
import { EmployeeModel } from "../modules/employee/models";

type DataType = {
  key: number;
} & EmployeeModel;

export const Employee: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      width: "1rem",
      render: (_, record: DataType) => (
        <RenderAvatar
          gender={record.Gender}
          size={40}
        />
      ),
    },
    {
      title: "Staff Code",
      dataIndex: "EmployeeCode",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeCode.localeCompare(b.EmployeeCode),
      render: (value: string, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrent(record)}
        >
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
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrent(record)}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Job Title",
      render: (_, record: DataType) => {
        const activeContract = record.Contracts.find((item) => +ContractStatus[item.Status] === ContractStatus.Active);
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setCurrent(record)}
          >
            {activeContract ? (
              <Tag color="#108ee9">
                {activeContract.Level.LevelName} {activeContract.Position.PositionName}
              </Tag>
            ) : (
              <Tag color="#2D4356">Not Available</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Employee Type",
      render: (_: string, record: DataType) => {
        const activeContract = record.Contracts.find((item) => +ContractStatus[item.Status] === ContractStatus.Active);
        if (activeContract) {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setCurrent(record)}
            >
              <EmployeeTypeTag type={activeContract.EmployeeType} />
            </div>
          );
        } else {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setCurrent(record)}
            >
              <Tag color="#2D4356">Not Available</Tag>
            </div>
          );
        }
      },
    },
    {
      title: "Join Date",
      dataIndex: "CreatedDate",
      render: (value: string, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrent(record)}
        >
          {new Date(value).toLocaleString()}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime(),
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
          <EditModal
            data={record}
            successCallback={fetchLevels}
          />
          <Button
            type="primary"
            style={{
              backgroundColor: "#2D4356",
            }}
          >
            Deactive
          </Button>
          <DeleteModal
            data={record}
            successCallback={fetchLevels}
          />
        </Space>
      ),
    },
  ];

  const [page, setPage] = React.useState<number>(1);

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
        setPositions(
          res.value.filter((v) => +Role[v.Role] === Role.Employee).map((item) => ({ ...item, key: item.Id }))
        );
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
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={positions}
        loading={loading}
        pagination={{
          current: page,
          defaultPageSize: 10,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showSizeChanger: true,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
      <DetailModal
        data={current}
        setData={setCurrent}
      />
    </>
  );
};
