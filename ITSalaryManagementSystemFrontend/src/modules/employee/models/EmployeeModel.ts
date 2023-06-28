import { EmployeeStatus, EmployeeType, Gender, Role } from "../../../constants/enum";

export type EmployeeModel = {
  Id: number;
  EmployeeName: string;
  EmployeeCode: string;
  Gender: Gender;
  Role: Role;
  Dob: string;
  CCCD: string;
  Address: string;
  CreatedDate: string;
  EmployeeType: EmployeeType;
  Email: string;
  Phone: string;
  Status: EmployeeStatus;
  IsFirstLogin: true;
};
