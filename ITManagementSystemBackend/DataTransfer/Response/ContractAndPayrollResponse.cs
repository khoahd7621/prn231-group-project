using BusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTransfer.Response
{
    public class ContractAndPayrollResponse
    {
        public PayRoll Payroll { get; set; }
        public Contract Contract { get; set; }
    }
}
