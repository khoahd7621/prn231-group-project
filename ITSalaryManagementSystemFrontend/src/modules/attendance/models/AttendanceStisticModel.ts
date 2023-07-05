import { Dayjs } from "dayjs";

export type AttendanceStisticModel = {
  Id: number,
  Date: Dayjs,
  Expected: number,
  Logged: number,
};
