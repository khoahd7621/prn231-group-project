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
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TakeLeaveStatus Status { get; set; }
        [Required]
        public TakeLeaveType Type { get; set; }
        [Required]
        public TakeLeaveCategory Category { get; set; }
        public string? Reason { get; set; }
        [Required]
        public int EmployeeId { get; set; }
    }
}
