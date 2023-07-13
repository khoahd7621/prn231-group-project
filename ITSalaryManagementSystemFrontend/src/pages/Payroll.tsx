import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { PayrollStatus } from "../constants/enum";
import PayrollApis from "../modules/payroll/apis/PayrollApis";
import { CreateModal, DeleteModal, DetailModal, PayrollStatusTag } from "../modules/payroll/components";
import { PayrollModel } from "../modules/payroll/models/PayrollModel";
import { formatMoney } from "../utils/formatter";

type DataType = {
  key: number;
} & PayrollModel;

export const Payroll: React.FC = () => {
  const DEFAULT_QUERY = "?$expand=Contract($expand=User,Position,Level)";
  const columns: ColumnsType<DataType> = [
    {
      title: "Month",
      dataIndex: "StartDate",
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
      title: "Employee",
      render: (_, record: DataType) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPayroll(record)}
        >
          {record.Contract.User.EmployeeCode} - {record.Contract.User.EmployeeName}
        </div>
      ),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Contract.User.EmployeeCode.localeCompare(b.Contract.User.EmployeeCode),
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
            <DeleteModal
              data={record}
              successCallback={() => fetchPayrolls(query)}
            />
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
    PayrollApis.getAll(query)
      .then((res) => {
        setPayrolls(res.value.map((item) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchPayrolls(query);
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
