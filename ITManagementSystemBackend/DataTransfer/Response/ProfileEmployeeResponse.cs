using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransfer.Response
{
    public class ProfileEmployeeResponse
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }
        public string Email { get; set; }
        public bool IsFirstLogin { get; set; }
    }
}
