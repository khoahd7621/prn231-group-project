import { LeaveStatus, LeaveCategory, LeaveType } from "../../../constants/enum";

export type LeaveModel = {
    Id: number;
    StartDate: string;
    EndDate: string;
    Type: LeaveType;
    LeaveDays: number;
    Category: LeaveCategory
    Status: LeaveStatus;
    Reason: string;
    EmployyeeId: number;
    User: {
        Id: number;
        EmployeeCode: string;
        EmployeeName: string;
      };
  };