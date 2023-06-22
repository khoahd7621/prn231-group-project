using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public decimal BaseSalaryPerHours { get; set; }
        [Required]
        public decimal OTSalaryPerHours { get; set; }
        [Required]
        public double BaseWorkingHours { get; set; }
        [Required]
        public double RealWorkingHours { get; set; }
        [Required]
        public double OTWorkingHours { get; set; }
        [Required]
        public decimal Bonus { get; set; }
        [Required]
        public Enum.EnumList.PayrollStatus Status { get; set; }
        [Required]
        public decimal Total { get; set; }

        public virtual Employee User { get; set; }
    }
}
