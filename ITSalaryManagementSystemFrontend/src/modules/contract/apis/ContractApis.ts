import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { ContractModel, CreatePayload, UpdatePayload } from "../models";

const ContractApis = {
  getAll: (): Promise<Response<ContractModel[]>> => AxiosClient.get("/Contract?$expand=User,Level,Position"),
  post: (data: CreatePayload): Promise<void> => AxiosClient.post("/Contract", data),
  put: (id: number, data: UpdatePayload): Promise<void> => AxiosClient.put(`/Contract/${id}`, data),
  activate: (id: number): Promise<void> => AxiosClient.patch(`/Contract/Activate/${id}`),
  deactivate: (id: number): Promise<void> => AxiosClient.patch(`/Contract/Deactivate/${id}`),
  delete: (id: number): Promise<void> => AxiosClient.delete(`/Contract/${id}`),
};

export default ContractApis;
