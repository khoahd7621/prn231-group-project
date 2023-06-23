import { Dayjs } from "dayjs";
import { LeaveStatus } from "../../../constants/enum";

export type LeaveForm = {
    date: Dayjs;
    type: string;
    status: LeaveStatus;
    reason: string;
    employyeeId: number;
  };