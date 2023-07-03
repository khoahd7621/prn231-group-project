import AxiosClient from "../../../configs/AxiosConfig";
import { ChangeFirstPassword, LoginPayload, User } from "../models";

const AuthApis = {
  login: (data: LoginPayload): Promise<string> => AxiosClient.post("/Authentication/Login", data),
  getProfile: (): Promise<User> => AxiosClient.get("/Authentication/Profile"),
  changeFirstPassword: (data: ChangeFirstPassword): Promise<void> =>
    AxiosClient.patch("/Authentication/FirstChangePassword", data),
  changePassword: (data: ChangeFirstPassword): Promise<void> =>
    AxiosClient.patch("/Authentication/ChangePassword", data),
};

export default AuthApis;
