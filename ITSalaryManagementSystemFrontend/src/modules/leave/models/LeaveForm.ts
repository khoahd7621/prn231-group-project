import { Dayjs } from "dayjs";
import { LeaveCategory, LeaveType } from "../../../constants/enum";

export type LeaveForm = {
    startDate: Dayjs;
    endDate: Dayjs;
    type: LeaveType;
    category: LeaveCategory;
    reason: string;
    employeeId: number;
  };