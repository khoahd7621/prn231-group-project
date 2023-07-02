import { Dayjs } from "dayjs";
import { AttendanceStatus, AttendanceType } from "../../../constants/enum";

export type AttendanceModel = {
  Id: number,
  Date: Dayjs,
  Hour: number,
  OTHour: number,
  Status: AttendanceStatus,
  Type: AttendanceType,
  EmployeeId: number,
  User: object
};
