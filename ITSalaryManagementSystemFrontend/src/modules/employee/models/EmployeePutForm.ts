import { Dayjs } from "dayjs";

import { Gender } from "../../../constants/enum";

export type EmployeePutForm = {
  employeeName: string;
  gender: Gender;
  dob: Dayjs;
  cccd: string;
  phone: string;
  address: string;
};
