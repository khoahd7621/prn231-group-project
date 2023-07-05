import { PayrollStatus } from "../../../constants/enum";
import { ContractModel } from "../../contract/models";

export type PayrollModel = {
  Id: number;
  ContractId: number;
  StartDate: string;
  EndDate: string;
  CreatedDate: string;
  Tax: number;
  BaseSalaryPerHours: number;
  OTSalaryPerHours: number;
  BaseWorkingHours: number;
  RealWorkingHours: number;
  OTWorkingHours: number;
  DayOfHasSalary: number;
  Bonus: number;
  Status: PayrollStatus;
  Total: number;
  Contract: ContractModel;
};
