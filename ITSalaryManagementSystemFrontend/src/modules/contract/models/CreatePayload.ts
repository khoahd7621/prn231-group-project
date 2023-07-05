import { EmployeeType, SalaryType } from "../../../constants/enum";

export type CreatePayload = {
  employeeId: number;
  employeeType: EmployeeType;
  startDate: string;
  endDate: string;
  baseSalary: number;
  insuranceRate: number;
  taxRate: number;
  dateOffPerYear: number;
  levelId: number;
  positionId: number;
  otSalaryRate: number;
  salaryType: SalaryType;
};
