import { Gender, Role } from "../../../constants/enum";

export type EmployeePost = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  role: Role;
  cccd: string;
  phone: string;
  address: string;
};
