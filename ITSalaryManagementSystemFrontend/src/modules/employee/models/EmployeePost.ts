import { Gender } from "../../../constants/enum";

export type EmployeePost = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  cccd: string;
  phone: string;
  address: string;
};
