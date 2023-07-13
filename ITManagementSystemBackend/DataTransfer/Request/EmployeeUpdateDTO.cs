using BusinessObject.Enum;
using System.ComponentModel.DataAnnotations;

namespace DataTransfer.Request
{
    public class EmployeeUpdateDTO
    {
        [Required]
        public string EmployeeName { get; set; }
        [Required]
        public EnumList.Gender Gender { get; set; }
        [Required]
        public DateTime Dob { get; set; }
        [Required, MinLength(10), MaxLength(12)]
        public string CCCD { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public EnumList.EmployeeType EmployeeType { get; set; }
        [Required]
        public string Phone { get; set; }
    }
}
