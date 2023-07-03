import { Role } from "../../../constants/enum";

export type User = {
  id: number;
  employeeName: string;
  employeeCode: string;
  email: string;
  role: Role;
  isFirstLogin: boolean;
};
