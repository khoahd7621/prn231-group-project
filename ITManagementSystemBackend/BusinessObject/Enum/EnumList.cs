namespace BusinessObject.Enum
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
            Deleted,
            Active,
            Passive
        }
        public enum EmployeeType
        {
            FullTime,
            PartTime
        }
        public enum ContractStatus
        {
            Deleted,
            Waiting,
            Active,
            Expired,
            Canceled
        }
        public enum AttendanceStatus
        {
            Deleted,
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
    }
}
