import dayjs from "dayjs";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "../assets/css/remixicon.css";
import "../assets/scss/style.scss";
import DashboardApis from "../modules/dashboard/apis/DashboardApis";
import { ContractModel } from "../modules/dashboard/models";
import { formatMoney } from "../utils/formatter";

const monthLabel = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const positionLabel = [
  "Software Engineering",
  "Business Analysis",
  "Automation Tester",
  "Project Manager",
  "Solution Architecture",
];

const ctxColor1 = "#506fd9";

//draw line
const dp3=[[0,40],[1,39],[2,35],[3,33],[4,28],[5,28],[6,24],[7,20],[8,17],[9,16],[10,19],[11,16],[12,13],[13,18],[14,17],[15,18],[16,18],[17,19],[18,18],[19,17],[20,20],[21,18],[22,17],[23,17],[24,15],[25,15],[26,14],[27,15],[28,18],[29,19],[30,23],[31,27],[32,30],[33,28],[34,29],[35,29],[36,27],[37,24],[38,22],[39,26],[40,28],[41,27],[42,30],[43,26],[44,22],[45,19],[46,16],[47,17],[48,20],[49,16],[50,12],[51,10],[52,7],[53,11],[54,15],[55,20],[56,22],[57,19],[58,18],[59,20],[60,17],[61,19],[62,18],[63,14],[64,9],[65,10],[66,6],[67,10],[68,12],[69,13],[70,18],[71,22],[72,22],[73,26],[74,22],[75,18],[76,19],[77,19],[78,18],[79,23],[80,20],[81,25],[82,28],[83,29],[84,27],[85,25],[86,25],[87,24],[88,20],[89,18],[90,18],[91,18],[92,22],[93,21],[94,26],[95,29],[96,26],[97,28],[98,30],[99,28],[100,30],[101,27],[102,30],[103,26],];
const seriesSix = [
  {
    name: "series1",
    data: dp3,
  },
  {
    name: "series2",
    data: dp3,
  },
];

const optionSix = {
  chart: {
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
    stacked: true,
    sparkline: {
      enabled: true,
    },
  },
  colors: ["#506fd9", "#85b6ff"],
  stroke: {
    curve: "straight",
    width: [0, 0],
  },
  yaxis: {
    min: 0,
    max: 60,
    show: false,
  },
  xaxis: {
    min: 20,
    max: 30,
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.75,
      opacityTo: 0.25,
    },
  },
  legend: { show: false },
  tooltip: { enabled: false },
};

export const DashBoard: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const [userCountByLevel, setUserCountByLevel] =
    React.useState<Map<string, number>>();
  const [userCountByPosition, setUserCountByPosition] =
    React.useState<Map<string, number>>();
  const [contractCount, setContractCount] = React.useState<number | undefined>(
    0
  );
  const [totalUserCount, setTotalUserCount] = React.useState<
    number | undefined
  >(0);
  const [waitingRequestCount, setWaitingRequestCount] =
    React.useState<number>(0);
  const [countTodayLeave, setCountTodayLeave] = React.useState<number>(0);
  const [countTomorrowLeave, setCountTomorrowLeave] = React.useState<number>(0);
  const [countRecent7DayAttendanceHour, setCountRecent7DayAttendanceHour] =
    React.useState<number>(0);
  const [
    countRecent14DayTo7DayAttendanceHour,
    setCountRecent14DayTo7DayAttendanceHour,
  ] = React.useState<number>(0);
  const [
    countRecent7DayAttendanceOvertimeHour,
    setCountRecent7DayAttendanceOvertimeHour,
  ] = React.useState<number>(0);
  const [
    countRecent14DayTo7DayAttendanceOvertimeHour,
    setCountRecent14DayTo7DayAttendanceOvertimeHour,
  ] = React.useState<number>(0);
  const effectRan = React.useRef(false);
  const [totalSalary, setTotalSalary] = React.useState<number>(0);
  const [thisYearSalary, setThisYearSalary] = React.useState<number>(0);
  const [lastYearSalary, setLastYearSalary] = React.useState<number>(0);
  const [thisMonthSalary, setThisMonthSalary] = React.useState<number>(0);
  const [lastMonthSalary, setLastMonthSalary] = React.useState<number>(0);
  const [thisYearDataBar, SetThisYearDataBar] = React.useState<number[]>();
  const [lastYearDataBar, SetLastYearDataBar] = React.useState<number[]>();
  const dataBarEmployeeByPosition = {
    labels: positionLabel,
    datasets: [
      {
        data: positionLabel.map((label) => {
          return userCountByPosition?.get(label) ?? 0;
        }),
        backgroundColor: [
          "#506fd9",
          "#33d685",
          "#ffc107",
          "#0dcaf0",
          "#ea4c89",
        ],
        barPercentage: 0.3,
      },
    ],
  };
  const optionBarEmployeeByPosition = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: userCountByPosition
          ? Math.max(...userCountByPosition.values())
          : 0,
        grid: {
          borderColor: "#e2e5ec",
          color: "#f3f5f9",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };
  const dataBarMonthlySalary = {
    labels: monthLabel,
    datasets: [
      {
        data: thisYearDataBar ??[],
        backgroundColor: ctxColor1,
        barPercentage: 0.5,
      },
    ],
  };
  const optionMonthlySalary = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: thisYearDataBar
        ? Math.max(...thisYearDataBar.values())
        : 0,
      },
    },
  };
  const dataEmployeeRemuneration = [
    {
      name: "series1",
      data: thisYearDataBar??[],
    },
    {
      name: "series2",
      data: lastYearDataBar??[],
    },
  ];
  const optionEmployeeRemuneration = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: ["#506fd9", "#85b6ff"],
    grid: {
      borderColor: "rgba(72, 94, 144, .1)",
      padding: {
        top: -20,
        left: 0,
      },
      yaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "straight",
      width: 1.5,
    },
    xaxis: {
      categories: monthLabel,
      labels: {
        style: {
          colors: "#6e7985",
          fontSize: "5px",
        },
      },
    },
    yaxis: { max: thisYearDataBar||lastYearDataBar
      ? Math.max(...lastYearDataBar?.values()??[1],...thisYearDataBar?.values()??[])*1.25
      : 0 },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
      },
    },
    legend: { show: false },
    tooltip: { enabled: false },
  };
  useEffect(() => {
    if (!effectRan.current) {
      setWaitingRequestCount(0);
      fetchData();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);
  const calculatePercentage: (value: number, total: number) => number = (value, total) => {
    return total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(0));
  };
  const fetchData = () => {
    setLoading(true);
    DashboardApis.getContractIncludeUserLevelAndProsition()
      .then((res) => {
        const userCountByLevelMap = new Map<string, number>();
        const userCountByPositionMap = new Map<string, number>();

        const totalUserSet = new Set<number>();
        setContractCount(res.value.length ?? 0);
        res.value.forEach((contract: ContractModel) => {
          const levelName = contract?.Level?.LevelName;
          const positionName = contract?.Position?.PositionName;
          const userId = contract?.User?.Id;
          if (
            levelName &&
            positionName &&
            userId &&
            !totalUserSet.has(userId)
          ) {
            userCountByPositionMap.set(
              positionName,
              (userCountByPositionMap.get(positionName) || 0) + 1
            );
            userCountByLevelMap.set(
              levelName,
              (userCountByLevelMap.get(levelName) || 0) + 1
            );
            totalUserSet.add(userId);
          }
        });
        setUserCountByLevel(userCountByLevelMap);
        setUserCountByPosition(userCountByPositionMap);
        setTotalUserCount(totalUserSet?.size ?? 0);
      })
      .catch((err) => console.log(err));
    const countRequestWaitingQuery = [
      "TakeLeave?$select=Id&$filter=Status eq 'WAITING'&$count=true",
      "Attendance?$select=Id&$filter=Status eq 'Waiting' &$count=true",
      "Contract?$select=Id&$filter=Status eq 'Waiting' &$count=true",
      "Payroll?$select=Id&$filter=Status eq 'Waiting' &$count=true",
    ];

    countRequestWaitingQuery.forEach((query) => {
      DashboardApis.getCount(query)
        .then((res) => {
          setWaitingRequestCount(
            (previousCount) => previousCount + res["@odata.count"]
          );
        })
        .catch((error) => {
          console.error("Error fetching count:", error);
        });
    });
    const today = dayjs();
    const tomorrow = today.add(1, "day");
    const lastWeek = today.subtract(7, "day");
    const lastTwoWeek = today.subtract(14, "day");

    DashboardApis.getCount(
      `TakeLeave?$select=Id&$filter=Status eq 'APPROVED' and StartDate le ${today
        ?.toISOString()
        .slice(0, 10)} and EndDate ge ${today
        ?.toISOString()
        .slice(0, 10)} &$count=true`
    )
      .then((res) => {
        setCountTodayLeave(res["@odata.count"]);
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
    DashboardApis.getCount(
      `TakeLeave?$select=Id&$filter=Status eq 'APPROVED' and StartDate le ${tomorrow
        ?.toISOString()
        .slice(0, 10)} and EndDate ge ${tomorrow
        ?.toISOString()
        .slice(0, 10)} &$count=true`
    )
      .then((res) => {
        setCountTomorrowLeave(res["@odata.count"]);
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });

    DashboardApis.getAttendanceByDateBetween(
      lastWeek?.toISOString().slice(0, 10),
      today?.toISOString().slice(0, 10)
    )
      .then((res) => {
        setCountRecent7DayAttendanceHour(
          res.value.reduce((sum, attendance) => sum + attendance.Hour, 0)
        );
        setCountRecent7DayAttendanceOvertimeHour(
          res.value.reduce((sum, attendance) => sum + attendance.OTHour, 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
    DashboardApis.getAttendanceByDateBetween(
      lastTwoWeek?.toISOString().slice(0, 10),
      lastWeek?.toISOString().slice(0, 10)
    )
      .then((res) => {
        setCountRecent14DayTo7DayAttendanceHour(
          res.value.reduce((sum, attendance) => sum + attendance.Hour, 0)
        );
        setCountRecent14DayTo7DayAttendanceOvertimeHour(
          res.value.reduce((sum, attendance) => sum + attendance.OTHour, 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
    DashboardApis.getAllApprovedPayroll()
      .then((res) => {
        setTotalSalary(
          res.value.reduce((sum, payroll) => sum + payroll.Total, 0)
        );
        const salaryByYearMap = new Map<number, Map<number, number>>();
        res.value.forEach((salary) => {
          if (salary) {
            const monthMap =
              salaryByYearMap.get(dayjs(salary.StartDate).year()) ??
              new Map<number, number>();
            monthMap.set(
              dayjs(salary.StartDate).month(),
              (monthMap.get(dayjs(salary.StartDate).month()) || 0) +
                salary.Total
            );
            salaryByYearMap.set(dayjs(salary.StartDate).year(), monthMap);
          }
        });
        const currentYear = dayjs().year();
        const currentMonth = dayjs().month();
        const lastMonth = dayjs().subtract(1, "month").month();

        let sum = 0;

        salaryByYearMap.forEach((value, key) => {
          if (key === currentYear) {
            value.forEach((flatValue) => (sum += flatValue));
          }
        });
        setThisYearSalary(sum);
        const lastYear = dayjs().subtract(1, "year").year();
        sum = 0;

        salaryByYearMap.forEach((value, key) => {
          if (key === lastYear) {
            value.forEach((flatValue) => (sum += flatValue));
          }
        });
        setLastYearSalary(sum);

        setThisMonthSalary(
          salaryByYearMap?.get(currentYear)?.get(currentMonth) ?? 0
        );
        setLastMonthSalary(
          salaryByYearMap?.get(currentYear)?.get(lastMonth) ?? 0
        );
        const dataBar1 = [];
        const dataBar2 = [];

        for (let month = 0; month < 12; month++) {
          let salary = salaryByYearMap?.get(currentYear)?.get(month) ?? 0;
          dataBar1.push(salary);
          salary = salaryByYearMap?.get(lastYear)?.get(month) ?? 0;
          dataBar2.push(salary);
        }
        SetThisYearDataBar(dataBar1);
        SetLastYearDataBar(dataBar2);        
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });

    setLoading(false);
  };
  return (
    <>
      <div className="main main-app p-3 p-lg-4">
        <h4 className="main-title mb-0">Welcome to Dashboard</h4>
        <Row className="g-3">
          <Col sm="4">
            <Card className="card-one">
              <Card.Body className="p-3">
                <div className="d-flex d-sm-block d-xl-flex align-items-center">
                  <div className={"helpdesk-icon text-white bg-primary"}>
                    <i className="ri-bell-line"></i>
                  </div>
                  <div className="ms-3 ms-sm-0 ms-xl-3 mt-sm-3 mt-xl-0">
                    <h2 className="card-value d-flex align-items-baseline mb-0">
                      {waitingRequestCount}
                    </h2>
                    <label className="card-label fs-sm fw-medium mb-1">
                      Requests
                    </label>
                    <div className="mutual-badge">
                      <label>On approval process</label>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="4">
            <Card className="card-one">
              <Card.Body className="p-3">
                <div className="d-flex d-sm-block d-xl-flex align-items-center">
                  <div className={"helpdesk-icon text-white bg-ui-02"}>
                    <i className="ri-user-line"></i>
                  </div>
                  <div className="ms-3 ms-sm-0 ms-xl-3 mt-sm-3 mt-xl-0">
                    <h2 className="card-value d-flex align-items-baseline mb-0">
                      {totalUserCount}
                    </h2>
                    <label className="card-label fs-sm fw-medium mb-1">
                      Employed Staffs
                    </label>
                    <div className="mutual-badge">
                      <label>Active</label>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="4">
            <Card className="card-one">
              <Card.Body className="p-3">
                <div className="d-flex d-sm-block d-xl-flex align-items-center">
                  <div className={"helpdesk-icon text-white bg-ui-03"}>
                    <i className="ri-star-smile-line"></i>
                  </div>
                  <div className="ms-3 ms-sm-0 ms-xl-3 mt-sm-3 mt-xl-0">
                    <h2 className="card-value d-flex align-items-baseline mb-0">
                      {contractCount}
                    </h2>
                    <label className="card-label fs-sm fw-medium mb-1">
                      Contracts
                    </label>
                    <div className="mutual-badge">
                      <label>Active</label>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="6" xl="6">
            <Card className="card-one">
              <Card.Header>
                <Card.Title as="h6">Employee Remuneration</Card.Title>
                <Nav className="nav-icon nav-icon-sm ms-auto">
                  <Nav.Link href="">
                    <i className="ri-refresh-line"></i>
                  </Nav.Link>
                  <Nav.Link href="">
                    <i className="ri-more-2-fill"></i>
                  </Nav.Link>
                </Nav>
              </Card.Header>
              <Card.Body>
                <div className="position-absolute p-1">
                  <label className="fw-medium fs-sm mb-1">Total Salary</label>
                  <h3 className="card-value">
                    {formatMoney.format(totalSalary)}
                  </h3>
                </div>

                <ReactApexChart
                  series={dataEmployeeRemuneration}
                  options={optionEmployeeRemuneration}
                  type="area"
                  height={195}
                  className="apex-chart-ten mb-4"
                />

                <ListGroup as="ul" className="list-group-one">
                  <ListGroup.Item
                    as="li"
                    className="px-0 d-flex align-items-center gap-2"
                  >
                    <span className={`badge-dot bg-primary`}></span>
                    <div>
                      <h6 className="mb-0">This Year</h6>
                    </div>
                    <div className="ms-auto text-end">
                      <h6 className="ff-numerals mb-0">
                        {formatMoney.format(thisYearSalary)}
                      </h6>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="px-0 d-flex align-items-center gap-2"
                  >
                    <span className={`badge-dot bg-info`}></span>
                    <div>
                      <h6 className="mb-0">Last Year</h6>
                    </div>
                    <div className="ms-auto text-end">
                      <h6 className="ff-numerals mb-0">
                        {formatMoney.format(lastYearSalary)}
                      </h6>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col sm="6" xl="3">
            <Card className="card-one">
              <Card.Header>
                <Card.Title as="h6">Employed Staffs By Level</Card.Title>
                <Nav className="nav-icon nav-icon-sm ms-auto">
                  <Nav.Link href="">
                    <i className="ri-refresh-line"></i>
                  </Nav.Link>
                  <Nav.Link href="">
                    <i className="ri-more-2-fill"></i>
                  </Nav.Link>
                </Nav>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-baseline gap-2 mb-0">
                  <ProgressBar className="flex-fill ht-5">
                    <ProgressBar
                      now={calculatePercentage(
                        userCountByLevel?.get("Intern") ?? 0,
                        totalUserCount ?? 0
                      )}
                    />
                    <ProgressBar
                      now={calculatePercentage(
                        userCountByLevel?.get("Fresher") ?? 0,
                        totalUserCount ?? 0
                      )}
                      variant="success"
                    />
                    <ProgressBar
                      now={calculatePercentage(
                        userCountByLevel?.get("Junior") ?? 0,
                        totalUserCount ?? 0
                      )}
                      variant="warning"
                    />
                    <ProgressBar
                      now={calculatePercentage(
                        userCountByLevel?.get("Senior") ?? 0,
                        totalUserCount ?? 0
                      )}
                      variant="info"
                    />
                    <ProgressBar
                      now={calculatePercentage(
                        userCountByLevel?.get("Specialized") ?? 0,
                        totalUserCount ?? 0
                      )}
                      variant="danger"
                    />
                  </ProgressBar>
                </div>
                <p className="fs-sm">
                  The percentage value assigned to the operating metric.
                </p>
                <Table className="table-ratings mb-0">
                  <tbody>
                    {[
                      {
                        dot: "primary",
                        label: "Intern",
                        count: userCountByLevel?.get("Intern") ?? 0,
                        percent: `${calculatePercentage(
                          userCountByLevel?.get("Intern") ?? 0,
                          totalUserCount ?? 0
                        )}%`,
                      },
                      {
                        dot: "success",
                        label: "Fresher",
                        count: userCountByLevel?.get("Fresher") ?? 0,
                        percent: `${calculatePercentage(
                          userCountByLevel?.get("Fresher") ?? 0,
                          totalUserCount ?? 0
                        )}%`,
                      },
                      {
                        dot: "warning",
                        label: "Junior",
                        count: userCountByLevel?.get("Junior") ?? 0,
                        percent: `${calculatePercentage(
                          userCountByLevel?.get("Junior") ?? 0,
                          totalUserCount ?? 0
                        )}%`,
                      },
                      {
                        dot: "info",
                        label: "Senior",
                        count: userCountByLevel?.get("Senior") ?? 0,
                        percent: `${calculatePercentage(
                          userCountByLevel?.get("Senior") ?? 0,
                          totalUserCount ?? 0
                        )}%`,
                      },
                      {
                        dot: "danger",
                        label: "Specialized",
                        count: userCountByLevel?.get("Specialized") ?? 0,
                        percent: `${calculatePercentage(
                          userCountByLevel?.get("Specialized") ?? 0,
                          totalUserCount ?? 0
                        )}%`,
                      },
                    ].map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`badge-dot bg-${item.dot}`}></span>
                        </td>
                        <td>
                          <strong>{item.label}</strong>
                        </td>
                        <td>{item.count}</td>
                        <td>{item.percent}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col xl="3">
            <Card className="card-one">
              <Card.Header>
                <Card.Title as="h6">Employed Staffs By Position</Card.Title>
                <Nav className="nav-icon nav-icon-sm ms-auto">
                  <Nav.Link href="">
                    <i className="ri-refresh-line"></i>
                  </Nav.Link>
                  <Nav.Link href="">
                    <i className="ri-more-2-fill"></i>
                  </Nav.Link>
                </Nav>
              </Card.Header>
              <Card.Body>
                <div className="chartjs-two">
                  <Bar
                    data={dataBarEmployeeByPosition}
                    options={optionBarEmployeeByPosition}
                    height={278}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl="8">
            <Row className="g-3">
              <Col xs="6" sm>
                <Card className="card-one">
                  <Card.Body className="p-3">
                    <div className="d-block fs-40 lh-1 text-primary mb-1">
                      <i className="ri-time-line"></i>
                    </div>
                    <h1 className="card-value mb-0 ls--1 fs-32">
                      {countRecent7DayAttendanceHour}
                    </h1>
                    <label className="d-block mb-1 fw-medium text-dark">
                      Working Hours
                    </label>
                    <small>
                      <span
                        className={`d-inline-flex ${
                          countRecent7DayAttendanceHour <=
                          countRecent14DayTo7DayAttendanceHour
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        {((countRecent7DayAttendanceHour -
                          countRecent14DayTo7DayAttendanceHour) /
                          (countRecent14DayTo7DayAttendanceHour == 0
                            ? 1
                            : countRecent14DayTo7DayAttendanceHour)) *
                          100}
                        %{" "}
                        <i
                          className={`d-inline-flex ${
                            countRecent7DayAttendanceHour <=
                            countRecent14DayTo7DayAttendanceHour
                              ? "ri-arrow-down-line"
                              : "ri-arrow-up-line"
                          }`}
                        ></i>
                      </span>{" "}
                      than last week
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="6" sm>
                <Card className="card-one">
                  <Card.Body className="p-3">
                    <div className="d-block fs-40 lh-1 text-danger mb-1">
                      <i className="ri-time-line"></i>
                    </div>
                    <h1 className="card-value mb-0 fs-32 ls--1">
                      {countRecent7DayAttendanceOvertimeHour}
                    </h1>
                    <label className="d-block mb-1 fw-medium text-dark">
                      Overtime Hours
                    </label>
                    <small>
                      <span
                        className={`d-inline-flex ${
                          countRecent7DayAttendanceOvertimeHour <
                          countRecent14DayTo7DayAttendanceOvertimeHour
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        {((countRecent7DayAttendanceOvertimeHour -
                          countRecent14DayTo7DayAttendanceOvertimeHour) /
                          (countRecent14DayTo7DayAttendanceOvertimeHour == 0
                            ? 1
                            : countRecent14DayTo7DayAttendanceOvertimeHour)) *
                          100}
                        %{" "}
                        <i
                          className={`d-inline-flex ${
                            countRecent7DayAttendanceOvertimeHour <
                            countRecent14DayTo7DayAttendanceOvertimeHour
                              ? "ri-arrow-down-line"
                              : "ri-arrow-up-line"
                          }`}
                        ></i>
                      </span>{" "}
                      than last week
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm>
                <Card className="card-one">
                  <Card.Body className="p-3">
                    <div className="d-block fs-40 lh-1 text- mb-1">
                      <i className="ri-calendar-2-line"></i>
                    </div>
                    <h1 className="card-value mb-0 fs-32 ls--1">
                      {countTodayLeave}
                    </h1>
                    <label className="d-block mb-1 fw-medium text-dark">
                      Today Leave
                    </label>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm>
                <Card className="card-one">
                  <Card.Body className="p-3">
                    <div className="d-block fs-40 lh-1 text-secondary mb-1">
                      <i className="ri-calendar-line"></i>
                    </div>
                    <h1 className="card-value mb-0 fs-32 ls--1">
                      {countTomorrowLeave}
                    </h1>
                    <label className="d-block mb-1 fw-medium text-dark">
                      Tomorrow Leave
                    </label>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="12">
                <Card className="card-one">
                  <Card.Header>
                    <Card.Title as="h6">Monthly Salary</Card.Title>
                    <Nav className="nav-icon nav-icon-sm ms-auto">
                      <Nav.Link href="">
                        <i className="ri-refresh-line"></i>
                      </Nav.Link>
                      <Nav.Link href="">
                        <i className="ri-more-2-fill"></i>
                      </Nav.Link>
                    </Nav>
                  </Card.Header>
                  <Card.Body className="px-3 pt-2">
                    <Row className="row-cols-auto g-3 g-xl-4 pt-2">
                      <Col>
                        <label className="fs-sm fw-medium text-secondary d-block mb-1">
                          This Month
                        </label>
                        <h3 className="card-value">
                          {formatMoney.format(thisMonthSalary)}
                        </h3>
                      </Col>
                      <Col>
                        <label className="fs-sm fw-medium text-secondary d-block mb-1">
                          Last Month
                        </label>
                        <h3 className="card-value">
                          {formatMoney.format(lastMonthSalary)}
                        </h3>
                      </Col>
                    </Row>
                    <Card.Body>
                      <Bar
                        data={dataBarMonthlySalary}
                        options={optionMonthlySalary}
                        className="ht-300"
                      />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col xl="4">
            <Row className="g-3">
              <Col md="6" xl="12">
                <Card className="card-one card-wallet">
                  <Card.Body>
                    <div className="finance-icon">
                      <i className="ri-mastercard-fill"></i>
                      <i className="ri-visa-line"></i>
                    </div>
                    <label className="card-title mb-1">Available Balance</label>
                    <h2 className="card-value mb-auto">
                      <span>$</span>130,058,000.50
                    </h2>

                    <label className="card-title mb-1">Account Number</label>
                    <div className="d-flex align-items-center gap-4 mb-3">
                      <div className="d-flex gap-1">
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                      </div>
                      <div className="d-flex gap-1">
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                      </div>
                      <div className="d-flex gap-1">
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                        <span className="badge-dot"></span>
                      </div>
                      <h5 className="ff-numerals mb-0">5314</h5>
                    </div>

                    <label className="card-title mb-1">Account Name</label>
                    <h5 className="mb-0">Secret Billionaire</h5>
                  </Card.Body>
                  <ReactApexChart
                    series={seriesSix}
                    options={optionSix}
                    height={268}
                    type="area"
                    className="apex-chart-two"
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};
