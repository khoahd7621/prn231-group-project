import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { LeavePatch } from "../models";
import { LeaveModel } from "../models/LeaveModel";
import { LeaveReq } from "../models/LeaveReq";
const LeaveApis = {
  getAll: (): Promise<Response<LeaveModel[]>> => AxiosClient.get("TakeLeave?$expand=User($select=EmployeeCode,Id,EmployeeName)"),
  post: (data: LeaveReq): Promise<void> => AxiosClient.post("TakeLeave", data),
  put: (id: number, data: LeaveReq): Promise<void> => AxiosClient.put(`TakeLeave(${id})`, data),
  patch: (id: number, data: LeavePatch): Promise<void> => AxiosClient.patch(`TakeLeave(${id})`, data),
  delete: (id: number): Promise<void> => AxiosClient.delete(`TakeLeave(${id})`),
};

export default LeaveApis;
