import { Dayjs } from "dayjs";

import { EmployeeType, Gender, Role } from "../../../constants/enum";

export type EmployeeForm = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: Dayjs;
  role: Role;
  cccd: string;
  phone: string;
  address: string;
  typeEmployee: EmployeeType;
};
