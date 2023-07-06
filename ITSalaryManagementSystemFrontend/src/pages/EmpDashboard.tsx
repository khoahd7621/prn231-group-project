import dayjs from "dayjs";
import React, { useEffect } from "react";

import type { ColumnsType } from "antd/es/table";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";

import { Button, Card, Col, DatePicker, Descriptions, Modal, Progress, Row, Space, Table, Tag, Typography } from "antd";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { AttendanceStatus, AttendanceType, ContractStatus } from "../constants/enum";
import { AttendanceModel, AttendanceStisticModel } from "../modules/attendance/models";
import { ContractModel } from "../modules/contract/models";
import { AttendanceStatusTag } from "../modules/attendance/components";
import { SearchOutlined } from "@ant-design/icons";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type DataAttendanceType = {
  key: number;
} & AttendanceModel;

type DataAttendanceStatisticType = {
  key: number;
} & AttendanceStisticModel;

type DataContracType = {
  key: number;
} & ContractModel;

const { Title: AntdTitle, Text } = Typography;
const { RangePicker } = DatePicker;

const optionsChart = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
const labels = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const pageSizeOptions = [5, 10, 20, 50];

export const EmpDashBoard: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const [attendancesWeek, setAttendancesWeek] = React.useState<DataAttendanceType[]>([]);
  const [attendancesMonthly, setAttendancesMonthly] = React.useState<DataAttendanceType[]>([]);
  const [attendancesWeekly, setAttendancesWeekly] = React.useState<DataAttendanceStatisticType[]>([]);
  const [contracts, setContracts] = React.useState<DataContracType[]>([]);
  const [contractSelect, setContractSelect] = React.useState<ContractModel>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentWeeksHours, setCurrentWeeksHours] = React.useState<number>(0);
  const [unApproveHours, setUnApproveHours] = React.useState<number>(0);
  const [previousWeekHours, setPreviousWeekHours] = React.useState<number>(0);
  const [previousOrvertimeWeekHours, setPreviiousOrvertimeWeekHours] = React.useState<number>(0);
  //#region 
  const chartData = {
    labels,
    datasets: [
      {
        label: "Hour",
        data: labels.map((item) => {
          let value = 0;
          for (const attendance of attendancesWeek) {
            const temp = dayjs(attendance.Date, "YYYY-MM-DD");
            const dayOfWeek = temp.format("dddd");
            if (dayOfWeek.toUpperCase() === item) {
              value = attendance.Hour;
              break;
            }
          }
          return value;
        }),
        backgroundColor: "blue",
      },
      {
        label: "OT Hour",
        data: labels.map((item) => {
          let value = 0;
          for (const attendance of attendancesWeek) {
            const temp = dayjs(attendance.Date, "YYYY-MM-DD");
            const dayOfWeek = temp.format("dddd");
            if (dayOfWeek.toUpperCase() === item) {
              value = attendance.Hour;
              break;
            }
          }
          return value;
        }),
        backgroundColor: "red",
      },
    ],
  };

  const columnsWeelyTable: ColumnsType<DataAttendanceStatisticType> = [
    {
      title: "Date",
      dataIndex: "key",
      defaultSortOrder: "ascend",
      render: (value: string) => <div>{value}</div>,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const dateA = new Date(a.Date.toString());
        const dateB = new Date(b.Date.toString());
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: "Expected",
      dataIndex: "Expected",
    },
    {
      title: "Logged",
      dataIndex: "Logged",
    },
    {
      render: (value: AttendanceStisticModel) => (
        <div>
          <Progress type="circle" percent={(value.Logged / value.Expected) * 100} size={30} />
        </div>
      ),
    },
    {
      render: (value: AttendanceStisticModel) =>
        value.Logged > value.Expected ? (
          <div>
            <Progress
              strokeColor={{ "0%": "red", "100%": "#red" }}
              type="circle"
              percent={((value.Logged - value.Expected) / value.Expected) * 100}
              size={30}
            />
          </div>
        ) : (
          <></>
        ),
    },
  ];

  const columnsMonthly: ColumnsType<DataAttendanceType> = [
    {
      title: "Date",
      dataIndex: "Date",
      sortDirections: ["descend", "ascend"],
      filterMultiple: false,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 10 }} onKeyDown={(e) => e.stopPropagation()}>
          <Space>
            <RangePicker
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e ? [e] : []);
              }}
              onPressEnter={() => confirm}
              style={{ marginBottom: 10, display: "flex" }}
            />
          </Space>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
      onFilter: (value, record) => {
        const recordDate = dayjs(record.Date);

        const startDate = value[0];
        const endDate = value[1];
        return startDate && endDate
          ? (recordDate.isAfter(startDate, "day") || recordDate.isSame(startDate, "day")) &&
              (recordDate.isBefore(endDate, "day") || recordDate.isSame(startDate, "day"))
          : true;
      },
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
  ];
  //#endregion
  useEffect(() => {
    fetchAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAttendances = () => {
    setLoading(true);
    const query = `?$expand=Attendances
    , Contracts($filter=Status eq 'Active' ;$expand=Level, Position)`;
    AttendanceApis.getEmployee(query)
      .then((res) => {
        setAttendancesWeek(
          (res as any).Attendances.filter(
            (item: { Status: string; Date: string }) =>
              item.Status === "Approved" &&
              dayjs(item.Date) >= dayjs().startOf("week") &&
              dayjs(item.Date) <= dayjs().endOf("week")
          ).map((item: { Id: any }) => ({ ...item, key: item.Id }))
        );
        setAttendancesMonthly(
          (res as any).Attendances.filter(
            (item: { Status: string; Date: string }) =>
              item.Status === "Approved" &&
              dayjs(item.Date) >= dayjs().startOf("month") &&
              dayjs(item.Date) <= dayjs().endOf("month")
          ).map((item: { Id: any }) => ({ ...item, key: item.Id }))
        );
        const attendanceByWeekly = (res as any).Attendances.filter(
          (item: { Status: string; Date: string }) =>
            item.Status === "Approved" &&
            dayjs(item.Date) >= dayjs().startOf("month") &&
            dayjs(item.Date) <= dayjs().endOf("month")
        ).reduce((acc: any, item: { Hour: any; OTHour: any; Id: any; Date: string }) => {
          const weekStartDate = dayjs(item.Date).startOf("week");
          const weekEndDate = dayjs(item.Date).endOf("week");
          const weekKey = `${weekStartDate.format("YYYY-MM-DD")}_${weekEndDate.format("YYYY-MM-DD")}`;
          if (!acc[weekKey]) {
            acc[weekKey] = {
              key: weekKey,
              Date: weekStartDate,
              Expected: 0,
              Logged: 0,
            };
          }
          acc[weekKey].Expected = 40;
          acc[weekKey].Logged += item.Hour + item.OTHour;

          return acc;
        }, {});
        setAttendancesWeekly(Object.values(attendanceByWeekly));
        setContracts((res as any).Contracts.map((item: { Id: any }) => ({ ...item, key: item.Id })));
        {
          const currentWeeksHours = (res as any).Attendances.filter(
            (item: { Status: string; Date: string }) =>
              item.Status === "Approved" &&
              dayjs(item.Date) >= dayjs().startOf("week") &&
              dayjs(item.Date) <= dayjs().endOf("week")
          ).map((item: { Id: any; Hour: any }) => item.Hour);
          const sumCurrentWeeksHours = currentWeeksHours.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue,
            0
          );
          setCurrentWeeksHours(sumCurrentWeeksHours);
        }
        {
          const unApprovedHours = (res as any).Attendances.filter(
            (item: { Status: string; Date: string }) =>
              item.Status == "Waiting" &&
              dayjs(item.Date) >= dayjs().startOf("week") &&
              dayjs(item.Date) <= dayjs().endOf("week")
          ).map((item: { Id: any; Hour: any }) => item.Hour);
          const sumUnApprovedHours = unApprovedHours.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue,
            0
          );
          setUnApproveHours(sumUnApprovedHours);
        }
        {
          const previousWeekHours = (res as any).Attendances.filter(
            (item: { Status: string; Date: string }) =>
              item.Status == "Approved" &&
              dayjs(item.Date) >= dayjs().startOf("week").subtract(1, "week") &&
              dayjs(item.Date) <= dayjs().endOf("week").subtract(1, "week")
          ).map((item: { Id: any; Hour: any }) => item.Hour);
          const sumPreviousWeekHours = previousWeekHours.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue,
            0
          );
          setPreviousWeekHours(sumPreviousWeekHours);
        }
        {
          const previiousOrvertimeWeekHours = (res as any).Attendances.filter(
            (item: { Status: string; Date: string }) =>
              item.Status == "Approved" &&
              dayjs(item.Date) >= dayjs().startOf("week").subtract(1, "week") &&
              dayjs(item.Date) <= dayjs().endOf("week").subtract(1, "week")
          ).map((item: { Id: any; Hour: any }) => item.Hour);
          const sumPreviiousOrvertimeWeekHours = previiousOrvertimeWeekHours.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue,
            0
          );
          setPreviiousOrvertimeWeekHours(sumPreviiousOrvertimeWeekHours);
        }
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const ShowDetailContract = (data: ContractModel) => {
    setContractSelect(data);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={{ display: "flex", gap: "3rem", marginBottom: "2rem" }}>
        <div style={{ width: "60%" }}>
          <Row gutter={24}>
            <Col span={6}>
              <Card title="Current weeks timesheet hours">
                <AntdTitle>{currentWeeksHours}</AntdTitle>
                <Text>Timesheets</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="All upapprove hours">
                <AntdTitle>{unApproveHours}</AntdTitle>
                <Text>Timesheets</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Previous week's timesheet hours">
                <AntdTitle>{previousWeekHours}</AntdTitle>
                <Text>Timesheets</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Previous week's overtime hours">
                <AntdTitle>{previousOrvertimeWeekHours}</AntdTitle>
                <Text>Timesheets</Text>
              </Card>
            </Col>
          </Row>

          <div
            style={{
              marginTop: "2rem",
            }}>
            <AntdTitle level={4}>Weekly attandance summary (hours)</AntdTitle>
            <Table
              size="small"
              columns={columnsWeelyTable}
              dataSource={attendancesWeekly}
              loading={loading}
              pagination={false}
            />
          </div>

          <div
            style={{
              marginTop: "2rem",
            }}>
            <AntdTitle level={4}>Monthly Attendance</AntdTitle>
            <Table
              columns={columnsMonthly}
              dataSource={attendancesMonthly}
              loading={loading}
              pagination={{
                pageSizeOptions,
                showSizeChanger: true,
                position: ["topLeft"],
              }}
            />
          </div>
        </div>
        <div style={{ width: "40%" }}>
          <div>
            <AntdTitle level={4}>
              Logged working hours from {dayjs().startOf("week").format("DD/MM/YYYY")} to{" "}
              {dayjs().endOf("week").format("DD/MM/YYYY")}
            </AntdTitle>
            <Bar options={optionsChart} data={chartData} />
          </div>

          <div
            style={{
              marginTop: "2rem",
            }}>
            <AntdTitle level={4}>Current Active Contract</AntdTitle>
            <Row gutter={24}>
              {contracts.map((item) => (
                <Col key={item.Id} span={12}>
                  <Card
                    title={dayjs(item.StartDate).format("DD-MM-YYYY") + "~" + dayjs(item.EndDate).format("DD-MM-YYYY")}
                    onClick={() => ShowDetailContract(item)}
                    style={{ cursor: "pointer" }}>
                    <Tag>{item.EmployeeType}</Tag>
                    <br />
                    <br />
                    <Tag> {item.SalaryType}</Tag>
                    <br />
                    <br />
                    {item.Status.toString() == ContractStatus[1].toString() ? (
                      <Tag color="success">{item.Status}</Tag>
                    ) : (
                      <Tag color="error">{item.Status}</Tag>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
      <Modal title="Detail Contract" footer={false} open={isModalOpen} width="80%" onCancel={handleCancel}>
        <Descriptions bordered column={6} layout="vertical">
          <Descriptions.Item label="Employee Type">{contractSelect?.EmployeeType}</Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {dayjs(contractSelect?.StartDate).format("DD-MM-YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="End Date"> {dayjs(contractSelect?.EndDate).format("DD-MM-YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Base Salary">{contractSelect?.BaseSalary} VND</Descriptions.Item>
          <Descriptions.Item label="Date Off Per Year">{contractSelect?.DateOffPerYear}</Descriptions.Item>
          <Descriptions.Item label="Level">{contractSelect?.Level.LevelName}</Descriptions.Item>
          <Descriptions.Item label="Insurance Rate">{contractSelect?.InsuranceRate}%</Descriptions.Item>
          <Descriptions.Item label="Tax Rate">{contractSelect?.TaxRate}%</Descriptions.Item>
          <Descriptions.Item label="Salary Type">{contractSelect?.SalaryType}.</Descriptions.Item>
          <Descriptions.Item label="Position">{contractSelect?.Position.PositionName}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="success">{contractSelect?.Status}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <div style={{ margin: "10px 0 10px 0" }}></div>
    </>
  );
};
