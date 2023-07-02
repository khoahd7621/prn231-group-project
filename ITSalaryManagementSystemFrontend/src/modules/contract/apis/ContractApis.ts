import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { ContractModel, CreatePayload } from "../models";

const ContractApis = {
  getAll: (): Promise<Response<ContractModel[]>> => AxiosClient.get("/Contract"),
  post: (data: CreatePayload): Promise<void> => AxiosClient.post("/Contract", data),
};

export default ContractApis;
