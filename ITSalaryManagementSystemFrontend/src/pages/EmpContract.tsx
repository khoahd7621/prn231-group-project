import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ContractStatus, EmployeeType, SalaryType } from "../constants/enum";
import { ContractDetail, ContractStatusTag, DetailModal } from "../modules/contract/components";
import { ContractModel } from "../modules/contract/models";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import { EmployeeTypeTag } from "../modules/employee/components";
import { formatMoney } from "../utils/formatter";

type DataType = {
  key: number;
} & ContractModel;

const { Title } = Typography;

export const EmpContract: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Start Date",
      dataIndex: "StartDate",
      render: (value: string, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrModalContract(record)}
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
          onClick={() => setCurrModalContract(record)}
        >
          {new Date(value).toLocaleDateString()}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.StartDate).unix() - dayjs(b.StartDate).unix(),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (value: ContractStatus, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrModalContract(record)}
        >
          <ContractStatusTag status={value} />
        </div>
      ),
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
          onClick={() => setCurrModalContract(record)}
        >
          <EmployeeTypeTag type={value} />
        </div>
      ),
    },
    {
      title: "Salary type",
      dataIndex: "SalaryType",
    },
    {
      title: "Base Salary",
      dataIndex: "BaseSalary",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.BaseSalary - b.BaseSalary,
      render: (value: number, record: DataType) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => setCurrModalContract(record)}
        >
          {formatMoney.format(value)}/{+SalaryType[record.SalaryType] === SalaryType.Gross ? "month" : "hour"}
        </div>
      ),
    },
  ];

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [contracts, setContracts] = useState<DataType[]>([]);
  const [currentContract, setCurrentContract] = useState<ContractModel | null>(null);
  const [currModalContract, setCurrModalContract] = useState<DataType | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = () => {
    setLoading(true);
    EmployeeApis.getCurrentEmployee("?$expand=Contracts($expand=User,Position,Level)")
      .then((res) => {
        const currContract = res.Contracts.find((item) => +ContractStatus[item.Status] === ContractStatus.Active);
        if (currContract) {
          setCurrentContract(currContract);
        }
        setContracts(res.Contracts.map((item) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  return (
    <>
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <Title level={4}>Current Active Contract</Title>
        {currentContract ? (
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              padding: "6px 10px",
              maxWidth: "500px",
            }}
          >
            <ContractDetail data={currentContract} />
          </div>
        ) : (
          <Tag color="#2D4356">Not Available</Tag>
        )}
      </div>
      <div>
        <Title level={4}>History</Title>
        <Table
          scroll={{ x: 1000 }}
          size="small"
          columns={columns}
          dataSource={contracts}
          loading={loading}
          pagination={{
            current: page,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "10"],
            showSizeChanger: true,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
      </div>
      {currModalContract && (
        <DetailModal
          data={currModalContract}
          setData={setCurrModalContract}
        />
      )}
    </>
  );
};
