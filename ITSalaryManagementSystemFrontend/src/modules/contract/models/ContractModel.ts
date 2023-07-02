import { ContractStatus, EmployeeType, SalaryType } from "../../../constants/enum";

export type ContractModel = {
  Id: number;
  EmployeeId: number;
  EmployeeType: EmployeeType;
  StartDate: string;
  EndDate: string;
  BaseSalary: number;
  DateOffPerYear: number;
  LevelId: number;
  InsuranceRate: number;
  TaxRate: number;
  SalaryType: SalaryType;
  PositionId: number;
  Status: ContractStatus;
};
