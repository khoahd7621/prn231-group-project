import { EmployeeStatus, Gender, Role } from "../../../constants/enum";
import { AttendanceModel } from "../../attendance/models";
import { ContractModel } from "../../contract/models";

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
  Email: string;
  Phone: string;
  Status: EmployeeStatus;
  IsFirstLogin: true;
  Contracts: ContractModel[];
  Attendances: AttendanceModel[];
};
