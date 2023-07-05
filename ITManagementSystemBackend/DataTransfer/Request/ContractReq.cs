using BusinessObject.Enum;
using System.ComponentModel.DataAnnotations;

namespace DataTransfer.Request
{
    public class ContractReq
    {
        [Required]
        public int EmployeeId { get; set; }
        [Required]
        public EnumList.EmployeeType EmployeeType { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public decimal BaseSalary { get; set; }

        public double OTSalaryRate { get; set; }

        public double InsuranceRate { get; set; }

        public double TaxRate { get; set; }
        [Required]
        public int DateOffPerYear { get; set; }
        [Required]
        public int LevelId { get; set; }
        [Required]
        public int PositionId { get; set; }
        [Required]
        public EnumList.SalaryType SalaryType { get; set; }
    }
}
