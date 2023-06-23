using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BusinessObject.Enum;
namespace DataTransfer.Request
{
    public class AttendanceReq
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public double Hour { get; set; }
        [Required]
        public double OTHour { get; set; }
        [Required]
        public EnumList.AttendanceStatus Status { get; set; }
        [Required]
        public int Type { get; set; }
        [Required]
        public int EmployeeId { get; set; }
    }
}
