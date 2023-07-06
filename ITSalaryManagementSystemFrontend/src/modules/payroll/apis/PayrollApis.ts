import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { CreatePayload } from "../models";
import { PayrollModel } from "../models/PayrollModel";

const PayrollApis = {
  getAll: (query: string): Promise<Response<PayrollModel[]>> => AxiosClient.get("/PayRoll" + query),
  post: (data: CreatePayload): Promise<Response<number[]>> => AxiosClient.post("/PayRoll", data),
  delete: (id: number): Promise<void> => AxiosClient.delete("/PayRoll/" + id),
  approve: (id: number): Promise<void> => AxiosClient.patch("/PayRoll/Approve/" + id),
  reject: (id: number): Promise<void> => AxiosClient.patch("/PayRoll/Reject/" + id),
};

export default PayrollApis;
