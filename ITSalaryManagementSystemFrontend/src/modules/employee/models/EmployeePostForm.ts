import { Dayjs } from "dayjs";

import { Gender } from "../../../constants/enum";

export type EmployeePostForm = {
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: Dayjs;
  cccd: string;
  phone: string;
  address: string;
};
