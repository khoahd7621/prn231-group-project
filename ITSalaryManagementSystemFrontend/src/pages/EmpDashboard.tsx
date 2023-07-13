import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { Card, Col, Progress, Row, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

import { AttendanceStatus, AttendanceType, ContractStatus } from "../constants/enum";
import { AttendanceStatusTag } from "../modules/attendance/components";
import { AttendanceModel, AttendanceStisticModel } from "../modules/attendance/models";
import { ContractDetail } from "../modules/contract/components";
import { ContractModel } from "../modules/contract/models";
import EmployeeApis from "../modules/employee/apis/EmployeeApis";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type DataAttendanceType = {
  key: number;
} & AttendanceModel;

type DataAttendanceStatisticType = {
  key: number;
} & AttendanceStisticModel;

const { Title: AntdTitle, Text } = Typography;

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
  const [loading, setLoading] = useState<boolean>(true);

  const [attendancesWeek, setAttendancesWeek] = useState<DataAttendanceType[]>([]);
  const [attendancesMonthly, setAttendancesMonthly] = useState<DataAttendanceType[]>([]);
  const [attendancesWeekly, setAttendancesWeekly] = useState<DataAttendanceStatisticType[]>([]);
  const [contract, setContract] = useState<ContractModel | null>(null);
  const [currentWeeksHours, setCurrentWeeksHours] = useState<number>(0);
  const [unApproveHours, setUnApproveHours] = useState<number>(0);
  const [previousWeekHours, setPreviousWeekHours] = useState<number>(0);
  const [previousOrvertimeWeekHours, setPreviiousOrvertimeWeekHours] = useState<number>(0);

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
              value = attendance.OTHour;
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
          <Progress
            type="circle"
            percent={(value.Logged / value.Expected) * 100}
            size={30}
          />
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

  useEffect(() => {
    fetchAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAttendances = () => {
    setLoading(true);
    const query = `?$expand=Attendances
    , Contracts($filter=Status eq 'Active' ;$expand=Level,Position,User)`;
    EmployeeApis.getCurrentEmployee(query)
      .then((res) => {
        setAttendancesWeek(
          res.Attendances.filter(
            (item) =>
              +AttendanceStatus[item.Status] === AttendanceStatus.Approved &&
              dayjs(item.Date) >= dayjs().startOf("week") &&
              dayjs(item.Date) <= dayjs().endOf("week")
          ).map((item) => ({ ...item, key: item.Id }))
        );
        setAttendancesMonthly(
          res.Attendances.filter(
            (item) =>
              +AttendanceStatus[item.Status] === AttendanceStatus.Approved &&
              dayjs(item.Date) >= dayjs().startOf("month") &&
              dayjs(item.Date) <= dayjs().endOf("month")
          ).map((item) => ({ ...item, key: item.Id }))
        );
        const attendanceByWeekly = res.Attendances.filter(
          (item) =>
            +AttendanceStatus[item.Status] === AttendanceStatus.Approved &&
            dayjs(item.Date) >= dayjs().startOf("month") &&
            dayjs(item.Date) <= dayjs().endOf("month")
        ).reduce((acc: any, item) => {
          const weekStartDate = dayjs(item.Date).startOf("week");
          const weekEndDate = dayjs(item.Date).endOf("week");
          const weekKey = `${weekStartDate.format("DD/MM/YYYY")} - ${weekEndDate.format("DD/MM/YYYY")}`;
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

        setContract(res.Contracts.find((item) => +ContractStatus[item.Status] === ContractStatus.Active) ?? null);

        {
          const currentWeeksHours = res.Attendances.filter(
            (item) =>
              +AttendanceStatus[item.Status] === AttendanceStatus.Approved &&
              dayjs(item.Date) >= dayjs().startOf("week") &&
              dayjs(item.Date) <= dayjs().endOf("week")
          ).map((item) => item.Hour);
          const sumCurrentWeeksHours = currentWeeksHours.reduce(
            (accumulator: number, currentValue: number) => accumulator + currentValue,
            0
          );
          setCurrentWeeksHours(sumCurrentWeeksHours);
        }
        {
          const unApprovedHours = res.Attendances.filter(
            (item) =>
              +AttendanceStatus[item.Status] === AttendanceStatus.Waiting &&
              dayjs(item.Date) >= dayjs().startOf("week") &&
              dayjs(item.Date) <= dayjs().endOf("week")
          ).map((item) => item.Hour);
          const sumUnApprovedHours = unApprovedHours.reduce(
            (accumulator: number, currentValue: number) => accumulator + currentValue,
            0
          );
          setUnApproveHours(sumUnApprovedHours);
        }
        {
          const previousWeekHours = res.Attendances.filter(
            (item) =>
              +AttendanceStatus[item.Status] === AttendanceStatus.Approved &&
              dayjs(item.Date) >= dayjs().startOf("week").subtract(1, "week") &&
              dayjs(item.Date) <= dayjs().endOf("week").subtract(1, "week")
          ).map((item) => item.Hour);
          const sumPreviousWeekHours = previousWeekHours.reduce(
            (accumulator: number, currentValue: number) => accumulator + currentValue,
            0
          );
          setPreviousWeekHours(sumPreviousWeekHours);
        }
        {
          const previiousOrvertimeWeekHours = res.Attendances.filter(
            (item) =>
              +AttendanceStatus[item.Status] === AttendanceStatus.Approved &&
              dayjs(item.Date) >= dayjs().startOf("week").subtract(1, "week") &&
              dayjs(item.Date) <= dayjs().endOf("week").subtract(1, "week")
          ).map((item) => item.Hour);
          const sumPreviiousOrvertimeWeekHours = previiousOrvertimeWeekHours.reduce(
            (accumulator: number, currentValue: number) => accumulator + currentValue,
            0
          );
          setPreviiousOrvertimeWeekHours(sumPreviiousOrvertimeWeekHours);
        }
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", gap: "3rem", marginBottom: "2rem" }}>
      <div style={{ width: "60%" }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card>
              <AntdTitle
                level={5}
                style={{
                  margin: 0,
                }}
              >
                Current weeks attendance hours
              </AntdTitle>
              <AntdTitle
                style={{
                  margin: "10px 0",
                }}
              >
                {currentWeeksHours}
              </AntdTitle>
              <Text>Attendances</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <AntdTitle
                level={5}
                style={{
                  margin: 0,
                }}
              >
                All upapprove attendance hours
              </AntdTitle>
              <AntdTitle
                style={{
                  margin: "10px 0",
                }}
              >
                {unApproveHours}
              </AntdTitle>
              <Text>Attendances</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <AntdTitle
                level={5}
                style={{
                  margin: 0,
                }}
              >
                Previous week's attendance hours
              </AntdTitle>
              <AntdTitle
                style={{
                  margin: "10px 0",
                }}
              >
                {previousWeekHours}
              </AntdTitle>
              <Text>Attendances</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <AntdTitle
                level={5}
                style={{
                  margin: 0,
                }}
              >
                Previous week's overtime hours
              </AntdTitle>
              <AntdTitle
                style={{
                  margin: "10px 0",
                }}
              >
                {previousOrvertimeWeekHours}
              </AntdTitle>
              <Text>Attendances</Text>
            </Card>
          </Col>
        </Row>

        <div
          style={{
            marginTop: "2rem",
          }}
        >
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
          }}
        >
          <AntdTitle level={4}>Monthly Attendance</AntdTitle>
          <Table
            scroll={{ x: 700 }}
            size="small"
            columns={columnsMonthly}
            dataSource={attendancesMonthly}
            loading={loading}
            pagination={{
              pageSizeOptions,
              showSizeChanger: true,
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
          <Bar
            options={optionsChart}
            data={chartData}
          />
        </div>

        <div
          style={{
            marginTop: "2rem",
          }}
        >
          <AntdTitle level={4}>Current Active Contract</AntdTitle>
          <Row gutter={24}>
            {contract ? (
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  padding: "6px 10px",
                }}
              >
                <ContractDetail data={contract} />
              </div>
            ) : (
              <Tag color="#2D4356">Not Available</Tag>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};
