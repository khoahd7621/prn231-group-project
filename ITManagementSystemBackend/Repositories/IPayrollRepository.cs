using DataTransfer.Request;
using DataTransfer.Response;

namespace Repositories
{
    public interface IPayrollRepository
    {
        public List<ContractAndPayrollResponse> CreatePayroll(PayrollReq payroll);
        public bool CheckEmployeeAlreadyHasPayroll(DateTime date, int empId);
    }
}
