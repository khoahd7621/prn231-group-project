import   { Dayjs } from "dayjs";

export type AttendancePutForm = {
  date: Dayjs ,
  hour: number,
  otHour: number,
  type: number,
  employeeId: number
};
