import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { EmployeeModel, EmployeePost, EmployeePut } from "../models";

const EmployeeApis = {
  getAll: (): Promise<Response<EmployeeModel[]>> =>
    AxiosClient.get("/Employee?$expand=Contracts($expand=Position,Level)"),
  post: (data: EmployeePost): Promise<void> => AxiosClient.post("/Employee", data),
  put: (id: number, data: EmployeePut): Promise<void> => AxiosClient.put(`/Employee/${id}`, data),
  delete: (id: number): Promise<void> => AxiosClient.delete(`/Employee/${id}`),
  getCurrentEmployee: (query?: string): Promise<EmployeeModel> => AxiosClient.get(`/SpecificEmployee${query ?? ""}`),
};

export default EmployeeApis;
