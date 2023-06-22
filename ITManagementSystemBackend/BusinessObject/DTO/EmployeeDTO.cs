using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class EmployeeDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public Enum.EnumList.Gender Gender { get; set; }
        [Required]
        public DateTime Dob { get; set; }
        [Required]
        public Enum.EnumList.Role Role { get; set; }
        [Required]
        public string CCCD { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public Enum.EnumList.EmployeeType TypeEmployee { get; set; }


    }
}
