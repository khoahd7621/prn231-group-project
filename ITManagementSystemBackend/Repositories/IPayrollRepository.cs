using DataTransfer.Request;
using DataTransfer.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public interface IPayrollRepository
    {
        public List<ContractAndPayrollResponse> CreatePayroll(PayrollReq payroll);
        public bool CheckEmployeeAlreadyHasPayroll(DateTime date, int empId);
    }
}
