using BusinessObject;
using BusinessObject.Enum;

namespace DataTransfer.Response
{
    public class EmployeeResponse
    {

        public int Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Gender { get; set; }

        public DateTime Dob { get; set; }

        public string Role { get; set; }

        public string CCCD { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public bool HasAnyContract { get; set; }

        public string Status { get; set; }
        public Contract Currentcontract { get; set; }
    }
}
