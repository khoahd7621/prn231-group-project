using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransfer.Request
{
    public class PayrollReq
    {
        [Required]
        public int EmployeeId { get; set; }
        [Required]
        public DateTime dateTime { get; set; }
    }
}
