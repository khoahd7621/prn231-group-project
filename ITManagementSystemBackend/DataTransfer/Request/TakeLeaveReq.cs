using BusinessObject;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransfer.Request
{
    public class TakeLeaveReq
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public TakeLeaveStatus Status { get; set; }
        [Required]
        public string Type { get; set; }

        public string? Reason { get; set; }
        [Required]
        public int EmployeeId { get; set; }
    }
}
