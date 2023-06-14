using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject
{
    public class PayRoll
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int EmployeeId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public int Tax { get; set; }
        [Required]
        public Decimal BaseSalaryPerHours { get; set; }
        [Required]
        public Decimal OTSalaryPerHours { get; set; }
        [Required]
        public Decimal BaseWorkingHours { get; set; }
        [Required]
        public Decimal RealWorkingHours { get; set; }
        [Required]
        public Decimal OTWorkingHours { get; set; }
        public Decimal Bonus { get; set; }
        [Required]
        public int Status { get; set; }
        [Required]
        public Decimal Total { get; set; }

        public virtual User User { get; set; }
    }
}
