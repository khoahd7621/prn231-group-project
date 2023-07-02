import { EmployeeType, SalaryType } from "../../../constants/enum";

export type UpdatePayload = {
  employeeType: EmployeeType;
  startDate: string;
  endDate: string;
  baseSalary: number;
  insuranceRate: number;
  taxRate: number;
  dateOffPerYear: number;
  levelId: number;
  positionId: number;
  salaryType: SalaryType;
};
