import AxiosClient from "../configs/AxiosConfig";

const DashboardApi = {
  getDashboard: () => AxiosClient.get("/dashboard"),
};

export default DashboardApi;
