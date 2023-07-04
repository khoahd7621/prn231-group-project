import { LeaveStatus, LeaveCategory, LeaveType } from "../../../constants/enum";

export type LeaveReq = {
    startDate: string;
    endDate: string;
    type: LeaveType;
    category: LeaveCategory;
    status: LeaveStatus;
    reason: string;
    employeeId: number;
  };