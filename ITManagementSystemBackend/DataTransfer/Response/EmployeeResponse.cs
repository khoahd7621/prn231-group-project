using BusinessObject.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransfer.Response
{
    public class EmployeeResponse
    {

        public int Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public EnumList.Gender Gender { get; set; }

        public DateTime Dob { get; set; }

        public EnumList.Role Role { get; set; }

        public string CCCD { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public bool CanDelete { get; set; }

        public EnumList.EmployeeType TypeEmployee { get; set; }
    }
}
