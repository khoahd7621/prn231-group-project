using System.ComponentModel.DataAnnotations;

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
