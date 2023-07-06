import { Response } from "../../../common/models";
import AxiosClient from "../../../configs/AxiosConfig";
import { ContractModel } from "../models";

const DashboardApis = {
  getContractIncludeUserLevelAndProsition: (): Promise<Response<ContractModel[]>> => AxiosClient.get("Contract?$expand=Level($select=LevelName),Position($select=PositionName),User($select=Id,Role,Status)&$filter=User/Status eq 'Active' and User/Role eq 'Employee' and Status eq 'Active'" ),
  getCount: (query:string): Promise<{
    "@odata.count": number;
  }> => AxiosClient.get(query),
  getAttendanceByDateBetween: (startDate: string, endDate:string): Promise<Response<{Hour:number,OTHour:number}[]>> => AxiosClient.get(`Attendance?$select=Hour,OTHour&$filter= Status eq 'Approved' and Date ge ${startDate} and Date le ${endDate}`),
  getAllApprovedPayroll: (): Promise<Response<{StartDate:string,EndDate:string,Total:number}[]>> => AxiosClient.get(`Payroll?$select=StartDate,EndDate,Total&$filter= Status eq 'Approved'`),
};

export default DashboardApis;
