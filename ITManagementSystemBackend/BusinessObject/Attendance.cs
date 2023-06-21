using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject
{
    public class Attendance
    {
        [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public double Hour { get; set; }
        [Required]
        public double OTHour { get; set; }
        [Required]
        public Enum.EnumList.AttendanceStatus Status { get; set; }
        [Required]
        public int Type { get; set; }
        [Required]
        public int EmployeeId { get; set; }

        public virtual Employee User { get; set; }
    }
   
}
