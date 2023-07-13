import dayjs from "dayjs";
import React, { useEffect } from "react";

import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ContractStatus, EmployeeType } from "../constants/enum";
import ContractApis from "../modules/contract/apis/ContractApis";
import {
  ActivateModal,
  ContractStatusTag,
  CreateModal,
  DeactivateModal,
  DeleteModal,
  DetailModal,
} from "../modules/contract/components";
import { ContractModel } from "../modules/contract/models";
import { EmployeeTypeTag } from "../modules/employee/components";
import { EmployeeModel } from "../modules/employee/models";

type DataType = {
  key: number;
} & ContractModel;

export const Contract: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Employee",
      dataIndex: "User",
      render: (value: EmployeeModel, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrentContract(record)}
        >
          {value.EmployeeCode} - {value.EmployeeName}
        </div>
      ),
    },
    {
      title: "Job Title",
      render: (_, record: DataType) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentContract(record)}
          >
            {record.Level.LevelName} {record.Position.PositionName}
          </div>
        );
      },
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      render: (value: string, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrentContract(record)}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.StartDate).unix() - dayjs(b.StartDate).unix(),
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      render: (value: string, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrentContract(record)}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.StartDate).unix() - dayjs(b.StartDate).unix(),
    },
    {
      title: "Employee Type",
      dataIndex: "EmployeeType",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeType.toString().localeCompare(b.EmployeeType.toString()),
      render: (value: EmployeeType, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrentContract(record)}
        >
          <EmployeeTypeTag type={value} />
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (value: ContractStatus, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrentContract(record)}
        >
          <ContractStatusTag status={value} />
        </div>
      ),
    },
    {
      width: "2rem",
      render: (_, record: DataType) => (
        <Space>
          {+ContractStatus[record.Status] === ContractStatus.Waiting && (
            <>
              <ActivateModal
                data={record}
                successCallback={successCallback}
              />
              <DeleteModal
                data={record}
                successCallback={fetchContracts}
              />
            </>
          )}
          {+ContractStatus[record.Status] === ContractStatus.Active && (
            <DeactivateModal
              data={record}
              successCallback={successCallback}
            />
          )}
        </Space>
      ),
    },
  ];

  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [contracts, setContracts] = React.useState<DataType[]>([]);
  const [currentContract, setCurrentContract] = React.useState<DataType | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = () => {
    setLoading(true);
    ContractApis.getAll()
      .then((res) => {
        setContracts(res.value.map((item) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.error(err));
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
          justifyContent: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <CreateModal successCallback={successCallback} />
      </div>
      <Table
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={contracts}
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
      <DetailModal
        data={currentContract}
        setData={setCurrentContract}
      />
    </>
  );
};
