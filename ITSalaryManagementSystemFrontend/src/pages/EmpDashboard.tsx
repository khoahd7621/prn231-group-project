import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import AttendanceApis from "../modules/attendance/apis/AttendanceApis";
import { AttendanceModel } from "../modules/attendance/models";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
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

type DataType = {
  key: number;
} & AttendanceModel;

export function EmpDashBoard() {
  const [attendances, setAttendances] = React.useState<DataType[]>([]);
  const weekFormat = "YYYY-MM-DD";
  const data = {
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
    const query = `&filter=date ge ${dayjs()
      .startOf("week")
      .format(weekFormat)} and date le ${dayjs().endOf("week").format(weekFormat)} and Status eq 'Approved'&$orderby=date`;
    AttendanceApis.getByEmployee(query)
      .then((res) => {
        (res as any).map((item: { Id: any }) => {
          ({ ...item, key: item.Id });
        });
        setAttendances((res as any).map((item: { Id: any }) => ({ ...item, key: item.Id })));
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
}
