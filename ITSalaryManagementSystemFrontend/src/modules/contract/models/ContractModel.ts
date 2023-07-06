import { ContractStatus, EmployeeType, SalaryType } from "../../../constants/enum";
import { EmployeeModel } from "../../employee/models";
import { LevelModel } from "../../level/models";
import { PayrollModel } from "../../payroll/models/PayrollModel";
import { PositionModel } from "../../position/models";

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
  User: EmployeeModel;
  Level: LevelModel;
  Position: PositionModel;
  PayRolls: PayrollModel[];
};
