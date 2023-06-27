import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { EmployeeModel } from "../models";
import { EmployeePut } from "../models/EmployeePut";
import { EmployeeReq } from "../models/EmployeeReq";

const EmployeeApis = {
  getAll: (): Promise<Response<EmployeeModel[]>> => AxiosClient.get("/Employee"),
  post: (data: EmployeeReq): Promise<void> => AxiosClient.post("/Employee", data),
  put: (id: number, data: EmployeePut): Promise<void> => AxiosClient.put(`/Employee/${id}`, data),
};

export default EmployeeApis;
