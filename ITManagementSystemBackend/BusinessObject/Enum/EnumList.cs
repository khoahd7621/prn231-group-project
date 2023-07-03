﻿namespace BusinessObject.Enum
{
    public class EnumList
    {
        public enum Role
        {
            Admin,
            Employee
        }
        public enum EmployeeStatus
        {
            Active,
            Deactive
        }
        public enum EmployeeType
        {
            FullTime,
            PartTime
        }
        public enum ContractStatus
        {
            Waiting,
            Active,
            Expired
        }
        public enum AttendanceStatus
        {
            Waiting,
            Approved,
            Rejected
        }
        public enum PayrollStatus
        {
            Deleted,
            Approved,
            Rejected
        }
        public enum Gender
        {
            Male,
            Female,
            Other
        }
        public enum SalaryType
        {
            Net,
            Gross
        }
    }
}
