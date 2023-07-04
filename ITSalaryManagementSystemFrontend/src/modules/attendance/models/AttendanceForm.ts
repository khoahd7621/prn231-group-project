import { Dayjs } from "dayjs";

export type AttendanceForm = {
  date: Dayjs
  hour: number,
  otHour: number,
  type :number,
  employeeId: number
};
export type AttendanceEmployeeForm = {
  date: Dayjs
  hour: number,
  otHour: number,
  type :number,
};

