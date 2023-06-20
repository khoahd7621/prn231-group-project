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
        public double Tax { get; set; }
        [Required]
        public Decimal BaseSalaryPerHours { get; set; }
        [Required]
        public Decimal OTSalaryPerHours { get; set; }
        [Required]
        public double BaseWorkingHours { get; set; }
        [Required]
        public double RealWorkingHours { get; set; }
        [Required]
        public double OTWorkingHours { get; set; }
        public Decimal Bonus { get; set; }
        [Required]
        public PayrollStatus Status { get; set; }
        [Required]
        public Decimal Total { get; set; }

        public virtual Employee User { get; set; }
    }
    public enum PayrollStatus
    {
        Deleted,
        Approved,
        Rejected
    }
}
