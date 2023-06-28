import { EmployeeType, Gender, Role } from "../../../constants/enum";

export type EmployeeReq = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  role: Role;
  cccd: string;
  phone: string;
  address: string;
  typeEmployee: EmployeeType;
};
