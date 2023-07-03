using DataTransfer.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public interface IPayrollRepository
    {
        public bool CreatePayroll(PayrollReq payroll);
    }
}
