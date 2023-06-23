import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { LeaveModel } from "../models/LeaveModel";
import { LeaveReq } from "../models/LeaveReq";
const LeaveApis = {
  getAll: (): Promise<Response<LeaveModel[]>> => AxiosClient.get("TakeLeave?$expand=User($select=EmployeeCode,Id)"),
  post: (data: LeaveReq): Promise<void> => AxiosClient.post("TakeLeave", data),
  put: (id: number, data: LeaveReq): Promise<void> => AxiosClient.put(`TakeLeave(${id})`, data),
  delete: (id: number): Promise<void> => AxiosClient.delete(`TakeLeave(${id})`),
};

export default LeaveApis;
