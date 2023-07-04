import dayjs from "dayjs";
import React, { useEffect } from "react";

import { Card, Col, Descriptions, Input, Modal, Row, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AttendanceStatus, AttendanceType } from "../constants/enum";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import { AttendanceStatusTag, DeleteModal, EditModal } from "../modules/attendance/components";
import { AttendanceModel } from "../modules/attendance/models";
import { ContractModel } from "../modules/contract/models";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
type DataAttendanceType = {
  key: number;
} & AttendanceModel;
type DataContracType = {
  key: number;
} & ContractModel;

const { Search } = Input;
const optionsChart = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Attendance in week",
    },
  },
  scales: {
    y: {
      max: 8,
      beginAtZero: true,
    },
  },
};

const labels = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
export const EmpDashBoard: React.FC = () => {
  const weekFormat = "YYYY-MM-DD";
  const columns: ColumnsType<DataAttendanceType> = [
    {
      title: "Date",
      dataIndex: "Date",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const dateA = new Date(a.Date.toString());
        const dateB = new Date(b.Date.toString());
        return dateA.getTime() - dateB.getTime();
      },
      render: (value: string) => <div>{dayjs(value).format("YYYY-MM-DD ")}</div>,
    },
    {
      title: "Hour",
      dataIndex: "Hour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Hour - b.Hour,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: "OTHour",
      dataIndex: "OTHour",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.OTHour - b.OTHour,
      render: (value: string) => <div>{value}</div>,
    },
    {
      title: "Status",
      dataIndex: "Status",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Status - b.Status,
      render: (value: AttendanceStatus) => (
        <div>
          <AttendanceStatusTag status={value} />
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "Type",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.Type - b.Type,
      render: (value: AttendanceType) => {
        switch (value) {
          case AttendanceType.Online.valueOf():
            return (
              <div>
                <Tag color="success">{AttendanceType[value]} </Tag>
              </div>
            );
          case AttendanceType.Offline.valueOf():
            return (
              <div>
                <Tag color="default">{AttendanceType[value]} </Tag>
              </div>
            );
        }
      },
    },
    {
      width: "20px",
      render: (_, record) => {
        switch (record.Status) {
          case 0:
            return (
              <Space>
                <EditModal data={record} successCallback={fetchAttendances} />
                <DeleteModal data={record} isDisable={false} successCallback={successCallback} />
              </Space>
            );
          case 2:
            return (
              <Space>
                <DeleteModal data={record} isDisable={false} successCallback={successCallback} />
              </Space>
            );
        }
      },
    },
  ];

  const [limit, setLimit] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [attendances, setAttendances] = React.useState<DataAttendanceType[]>([]);
  const [contracts, setContracts] = React.useState<DataContracType[]>([]);
  const [contractSelect, setContractSelect] = React.useState<ContractModel>();
  const chartData = {
    labels,
    datasets: [
      {
        label: "Hour",
        data: labels.map((item) => {
          let value = 0;
          attendances.find((attendance) => {
            ({ ...attendance, key: attendance.Id });
            const temp = dayjs(attendance.Date, "YYYY-MM-DD");
            const dayOfWeek = temp.format("dddd");
            if (dayOfWeek.toUpperCase() === item) {
              value = attendance.Hour;
              return true;
            }
            return false;
          });
          return value;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "OT Hour",
        data: labels.map((item) => {
          let value = 0;
          attendances.find((attendance) => {
            ({ ...attendance, key: attendance.Id });
            const temp = dayjs(attendance.Date, "YYYY-MM-DD");
            const dayOfWeek = temp.format("dddd");
            if (dayOfWeek.toUpperCase() === item) {
              value = attendance.Hour;
              return true;
            }
            return false;
          });
          return value;
        }),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = () => {
    setLoading(true);
    const query = `?$expand=Attendances($filter=
    date ge ${dayjs().startOf("week").format(weekFormat)} 
    and date le ${dayjs().endOf("week").format(weekFormat)} 
    and Status eq 'Approved')
    , Contracts($filter=Status eq 'Active' ;$expand=Level, Position)`;
    AttendanceApis.getEmployee(query)
      .then((res) => {
        setAttendances(
          (res as any).Attendances.map((item: { Id: any }) => ({ ...item, key: item.Id }))
        );
        setContracts(
          (res as any).Contracts.map((item: { Id: any }) => ({ ...item, key: item.Id }))
        );
        setTotal((res as any).Attendances.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchAttendances();
  };
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const ShowDetailContract = (data: ContractModel) => {
    setContractSelect(data);
    console.log(data);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%", height: "60%" }}>
          <Bar options={optionsChart} data={chartData} />
        </div>
        <div style={{ borderLeft: "1px solid", margin: "10px" }}></div>
        <div style={{ width: "60%", height: "60%%" }}>
          <Row gutter={24}>
            {contracts.map((item) => (
              <Col span={12}>
                <Card
                  key={item.Id}
                  title={
                    dayjs(item.StartDate).format("DD-MM-YYYY") +
                    "~" +
                    dayjs(item.EndDate).format("DD-MM-YYYY")
                  }
                  bordered={true}
                  onClick={() => ShowDetailContract(item)}
                  style={{ cursor: "pointer" }}>
                  {item.EmployeeType}
                  <p></p>
                  {item.SalaryType}
                  <p></p>
                  {item.Status}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Modal
        title="Detail Contract"
        footer={false}
        open={isModalOpen}
        width="80%"
        onCancel={handleCancel}>
        <Descriptions bordered column={6} layout="vertical">
          <Descriptions.Item label="Employee Type">
            {contractSelect?.EmployeeType}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">{contractSelect?.StartDate}</Descriptions.Item>
          <Descriptions.Item label="End Date">{contractSelect?.EndDate}</Descriptions.Item>
          <Descriptions.Item label="Base Salary">{contractSelect?.BaseSalary}$</Descriptions.Item>
          <Descriptions.Item label="Date Off Per Year">
            {contractSelect?.DateOffPerYear}
          </Descriptions.Item>
          <Descriptions.Item label="Level">{contractSelect?.Level.LevelName}</Descriptions.Item>
          <Descriptions.Item label="Insurance Rate">
            {contractSelect?.InsuranceRate}%
          </Descriptions.Item>
          <Descriptions.Item label="Tax Rate">{contractSelect?.TaxRate}%</Descriptions.Item>
          <Descriptions.Item label="Salary Type">{contractSelect?.SalaryType}.</Descriptions.Item>
          <Descriptions.Item label="Position">
            {contractSelect?.Position.PositionName}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="success">{contractSelect?.Status}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}>
        <Search
          placeholder="Search attendance"
          style={{
            width: 400,
          }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={attendances}
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
