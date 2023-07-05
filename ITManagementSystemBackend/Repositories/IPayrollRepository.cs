using BusinessObject;
using DataTransfer.Request;

namespace Repositories
{
    public interface IPayrollRepository
    {
        public List<int> CreatePayroll(PayrollReq payroll);
        public bool CheckEmployeeAlreadyHasPayroll(DateTime date, int empId);
        public List<PayRoll> GetAllPayrolls();
        public List<PayRoll> GetListPayrollByEmpId(int empId);
        public PayRoll GetPayRollById(int id);

        public void UpdatePayroll(PayRoll payroll);
        public void DeletePayroll(PayRoll payRoll);
    }
}
