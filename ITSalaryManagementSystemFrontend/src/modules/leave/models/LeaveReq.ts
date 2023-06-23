import { LeaveStatus } from "../../../constants/enum";

export type LeaveReq = {
    date: string;
    type: string;
    status: LeaveStatus;
    reason: string;
    employyeeId: number;
  };