import { Gender } from "../../../constants/enum";

export type EmployeePut = {
  employeeName: string;
  gender: Gender;
  dob: string;
  cccd: string;
  address: string;
  phone: string;
};
