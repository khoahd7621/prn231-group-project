export enum Gender {
  Male,
  Female,
  Other,
}

export enum Role {
  Admin,
  Employee,
}

export enum EmployeeStatus {
  Deleted,
  Active,
  Passive,
}

export enum EmployeeType {
  FullTime,
  PartTime,
}

export enum ContractStatus {
  Deleted,
  Waiting,
  Active,
  Expired,
  Canceled,
}

export enum AttendanceStatus {
  Deleted,
  Waiting,
  Approved,
  Rejected,
}

export enum PayrollStatus {
  Deleted,
  Approved,
  Rejected,
}

export enum LeaveStatus {
  DELETED = 0,
  WAITING = 1,
  APPROVED = 2,
  REJECTED = 4
}

export enum LeaveCategory {
  ONE_DAY_LEAVE = 0,
  SERVERAL_DAYS_LEAVE = 1
}
export enum LeaveType {
  ANNUAL_LEAVE = 0,
  SICK_LEAVE = 1,
  MATERNITY_LEAVE = 2,
  PATERNITY_LEAVE = 3,
  BEREAVEMENT_LEAVE = 4,
  PUBLIC_HOLIDAY = 5,
  UNPAID_LEAVE
}