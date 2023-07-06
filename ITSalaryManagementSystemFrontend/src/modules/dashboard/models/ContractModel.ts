import { EmployeeStatus, Role } from "../../../constants/enum";

export type ContractModel = {
    Id: number;
    Level: {
      LevelName: string;
    };
    Position: {
      PositionName: string;
    };
    User: {
      Id: number;
      Role: Role;
      Status: EmployeeStatus;
    };
  }