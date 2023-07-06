import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { PayrollStatus } from "../constants/enum";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import { ApproveModal, DetailModal, PayrollStatusTag, RejectModal } from "../modules/payroll/components";
import { PayrollModel } from "../modules/payroll/models/PayrollModel";
import { formatMoney } from "../utils/formatter";

type DataType = {
  key: number;
} & PayrollModel;

export const EmpPayroll: React.FC = () => {
  const DEFAULT_QUERY = "?$expand=Contracts($expand=User,Position,Level,Payrolls)";
  const columns: ColumnsType<DataType> = [
    {
      title: "Month",
      dataIndex: "CreatedDate",
      render: (value: string, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPayroll(record)}
        >
          {dayjs(value).format("MM/YYYY")}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.CreatedDate).unix() - dayjs(b.CreatedDate).unix(),
    },
    {
      title: "Amount",
      dataIndex: "Total",
      render: (value: number, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPayroll(record)}
        >
          {formatMoney.format(value)}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Total - b.Total,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      render: (value: number, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPayroll(record)}
        >
          {dayjs(value).format("DD/MM/YYYY")}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.CreatedDate).unix() - dayjs(b.CreatedDate).unix(),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (value: PayrollStatus, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPayroll(record)}
        >
          <PayrollStatusTag status={value} />
        </div>
      ),
    },
    {
      width: "2rem",
      render: (_, record: DataType) => (
        <Space>
          {+PayrollStatus[record.Status] === PayrollStatus.Waiting && (
            <Space>
              <ApproveModal
                data={record}
                successCallback={() => fetchPayrolls(query)}
              />
              <RejectModal
                data={record}
                successCallback={() => fetchPayrolls(query)}
              />
            </Space>
          )}
        </Space>
      ),
    },
  ];

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [query] = useState<string>(DEFAULT_QUERY);
  const [payrolls, setPayrolls] = useState<DataType[]>([]);
  const [currentPayroll, setCurrentPayroll] = useState<DataType | null>(null);

  useEffect(() => {
    fetchPayrolls(query);
  }, [query]);

  const fetchPayrolls = (query: string) => {
    setLoading(true);
    EmployeeApis.getCurrentEmployee(query)
      .then((res) => {
        const contracts = res.Contracts;
        const payrolls: PayrollModel[] = [];
        contracts.forEach((contract) => {
          contract.PayRolls.forEach((payroll) => {
            payroll.Contract = contract;
            payrolls.push(payroll);
          });
        });
        payrolls.length > 0 && setPayrolls(payrolls.map((payroll) => ({ ...payroll, key: payroll.Id })));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Table
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={payrolls}
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
        data={currentPayroll}
        setData={setCurrentPayroll}
      />
    </>
  );
};
