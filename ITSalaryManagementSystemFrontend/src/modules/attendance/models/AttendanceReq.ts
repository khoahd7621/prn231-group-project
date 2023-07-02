import { Dayjs } from "dayjs";


export type AttendanceReq = {
  date: string,
  hour: number,
  otHour: number,
  type: number,
  employeeId: number
};
