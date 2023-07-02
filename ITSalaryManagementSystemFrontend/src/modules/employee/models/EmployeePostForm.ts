import { Dayjs } from "dayjs";

import { Gender, Role } from "../../../constants/enum";

export type EmployeePostForm = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: Dayjs;
  role: Role;
  cccd: string;
  phone: string;
  address: string;
};
