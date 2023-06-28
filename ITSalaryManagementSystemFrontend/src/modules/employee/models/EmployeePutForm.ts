import { Dayjs } from "dayjs";

import { EmployeeType, Gender, Role } from "../../../constants/enum";

export type EmployeePutForm = {
  employeeName: string;
  gender: Gender;
  dob: Dayjs;
  role: Role;
  cccd: string;
  phone: string;
  address: string;
  employeeType: EmployeeType;
};
