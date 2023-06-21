import { EmployeeStatus, EmployeeType, Gender, Role } from "../../../constants/enum";

export type EmployeeModel = {
  id: number;
  employeeName: string;
  employeeCode: number;
  gender: Gender;
  role: Role;
  dob: string;
  cccd: string;
  address: string;
  createdDate: string;
  employeeType: EmployeeType;
  email: string;
  phone: string;
  status: EmployeeStatus;
  isFirstLogin: boolean;
};
