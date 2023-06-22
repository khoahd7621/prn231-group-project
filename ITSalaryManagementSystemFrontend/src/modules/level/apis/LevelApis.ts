import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { LevelModel, LevelReq } from "../models";

const LevelApis = {
  getAll: (): Promise<Response<LevelModel[]>> => AxiosClient.get("Level"),
  post: (data: LevelReq): Promise<void> => AxiosClient.post("Level", data),
  put: (id: number, data: LevelReq): Promise<void> => AxiosClient.put(`Level(${id})`, data),
  delete: (id: number): Promise<void> => AxiosClient.delete(`Level(${id})`),
};

export default LevelApis;
