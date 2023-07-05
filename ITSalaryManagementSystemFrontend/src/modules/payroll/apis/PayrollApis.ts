import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { CreatePayload } from "../models";
import { PayrollModel } from "../models/PayrollModel";

const PayrollApis = {
  getAll: (query: string): Promise<Response<PayrollModel[]>> => AxiosClient.get("/PayRoll" + query),
  post: (data: CreatePayload): Promise<Response<number[]>> => AxiosClient.post("/PayRoll", data),
};

export default PayrollApis;
