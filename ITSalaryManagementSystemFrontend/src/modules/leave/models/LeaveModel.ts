import { LeaveStatus } from "../../../constants/enum";

export type LeaveModel = {
    Id: number;
    Date: string;
    Type: string;
    Status: LeaveStatus;
    Reason: string;
    EmployyeeId: number;
    User: {
        Id: number;
        EmployeeCode: string;
      };
  };