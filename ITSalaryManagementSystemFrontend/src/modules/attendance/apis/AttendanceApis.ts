import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { AttendanceModel } from "../models";
import { AttendancePut } from "../models/AttendancePut";
import { AttendanceEmployeeReq, AttendanceReq } from "../models/AttendanceReq";

const AttendanceApis = {
  getAll: (): Promise<Response<AttendanceModel[]>> => AxiosClient.get("/Attendance?$expand=User"),
  getEmployee: (query: string): Promise<Response<AttendanceModel[]>> =>
    AxiosClient.get("/SpecificEmployee" + query),
  post: (data: AttendanceReq): Promise<void> => AxiosClient.post("/Attendance", data),
  postByEmployee: (data: AttendanceEmployeeReq): Promise<void> =>
    AxiosClient.post("/AttendanceEmployee", data),
  put: (id: number, data: AttendancePut): Promise<void> =>
    AxiosClient.put(`/Attendance/${id}`, data),
  delete: (id: number): Promise<void> => AxiosClient.delete(`/Attendance/${id}`),
  patch: (id: number, attendanceStatus: number): Promise<void> => {
    return AxiosClient.patch(`/Attendance(${id})?attendanceStatus=${attendanceStatus}`);
  },
};

export default AttendanceApis;
