import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { PositionModel, PositionReq } from "../models";

const PositionApis = {
  getAll: (): Promise<Response<PositionModel[]>> => AxiosClient.get("Position"),
  post: (data: PositionReq): Promise<void> => AxiosClient.post("Position", data),
  put: (id: number, data: PositionReq): Promise<void> => AxiosClient.put(`Position(${id})`, data),
  delete: (id: number): Promise<void> => AxiosClient.delete(`Position(${id})`),
};

export default PositionApis;
