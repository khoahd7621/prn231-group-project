import { Gender, Role } from "../../../constants/enum";

export type EmployeePut = {
  employeeName: string;
  gender: Gender;
  role: Role;
  dob: string;
  cccd: string;
  address: string;
  phone: string;
};
