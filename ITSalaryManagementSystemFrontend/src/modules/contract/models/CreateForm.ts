import { Dayjs } from "dayjs";

import { EmployeeType, SalaryType } from "../../../constants/enum";

export type CreateForm = {
  employeeId: number;
  employeeType: EmployeeType;
  startDate: Dayjs;
  endDate: Dayjs;
  baseSalary: number;
  insuranceRate: number;
  taxRate: number;
  dateOffPerYear: number;
  levelId: number;
  positionId: number;
  otSalaryRate: number;
  salaryType: SalaryType;
};
