import React, { useEffect } from "react";

import { Button, Input, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ContractStatus, EmployeeStatus, Role } from "../constants/enum";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import {
  ActiveModal,
  CreateModal,
  DeactivateModal,
  DeleteModal,
  DetailModal,
  EditModal,
  EmployeeStatusTag,
  EmployeeTypeTag,
  RenderAvatar,
} from "../modules/employee/components";
import { EmployeeModel } from "../modules/employee/models";
import { SearchOutlined } from "@ant-design/icons";

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

      filterMultiple: false,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{ padding: 8 }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={clearFilters}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
      onFilter: (value, record) =>
        (record).EmployeeCode.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),

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
      filterMultiple: false,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
          style={{ padding: 8 }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={clearFilters}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
      onFilter: (value, record) =>
        (record).EmployeeName.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),

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
      filters: [
        {
          text: EmployeeStatus[0],
          value: EmployeeStatus[0],
        },
        {
          text: EmployeeStatus[1],
          value: EmployeeStatus[1],
        },
      ],
      filterMode: "tree",
      onFilter: (value: any, record) => record.Status.toString() === value.toString(),
      render: (value: EmployeeStatus) => <EmployeeStatusTag status={value} />,
    },
    {
      width: "2rem",
      render: (_, record: DataType) => (
        <Space>
          <EditModal
            data={record}
            successCallback={fetchEmployees}
          />
          {+EmployeeStatus[record.Status] === EmployeeStatus.Active && (
            <DeactivateModal
              data={record}
              successCallback={fetchEmployees}
            />
          )}
          {+EmployeeStatus[record.Status] === EmployeeStatus.Deactive && (
            <ActiveModal
              data={record}
              successCallback={fetchEmployees}
            />
          )}
          <DeleteModal
            data={record}
            successCallback={fetchEmployees}
          />
        </Space>
      ),
    },
  ];

  const [page, setPage] = React.useState<number>(1);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [employees, setEmployees] = React.useState<DataType[]>([]);
  const [current, setCurrent] = React.useState<DataType | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    EmployeeApis.getAll()
      .then((res) => {
        setEmployees(
          res.value.filter((v) => +Role[v.Role] === Role.Employee).map((item) => ({ ...item, key: item.Id }))
        );
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchEmployees();
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
        dataSource={employees}
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
