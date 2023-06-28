using BusinessObject.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
