using BusinessObject;

namespace DataTransfer.Response
{
    public class EmployeeResponse
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }
        public string Gender { get; set; }
        public string Role { get; set; }
        public DateTime Dob { get; set; }
        public string CCCD { get; set; }
        public string Address { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public bool IsFirstLogin { get; set; }
        public bool HasAnyContract { get; set; }
        public Contract CurrentContract { get; set; }
    }
}
