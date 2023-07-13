using BusinessObject;
using DataAccess;
using DataTransfer.Request;
using Repositories.Helper;


namespace Repositories.Impl
{
    public class PayrollRepository : IPayrollRepository
    {
        private ITakeLeaveRepository takeLeaveRepository;
        public PayrollRepository(ITakeLeaveRepository takeLeaveRepository)
        {
            this.takeLeaveRepository = takeLeaveRepository;
        }

        public bool CheckEmployeeAlreadyHasPayroll(DateTime date, int empId)
        {
            var listPayRollOfThisEmployee = PayrollDAO.GetPayRollByEmployeeId(empId);
            if (listPayRollOfThisEmployee == null) return true;
            var checkList = new List<PayRoll>();
            foreach (var payroll in listPayRollOfThisEmployee)
            {
                if ((payroll.StartDate.Date.Month == date.Date.Month && payroll.StartDate.Date.Year == date.Date.Year) && (payroll.Status == BusinessObject.Enum.EnumList.PayrollStatus.Approved || payroll.Status == BusinessObject.Enum.EnumList.PayrollStatus.Waiting))
                    checkList.Add(payroll);
            }
            if (checkList.Count == 0) return true;
            return false;
        }

        public List<int> CreatePayroll(PayrollReq req)
        {
            // check employee has contract in this month & year
            var contractInMonth = ContractDAO.GetContractInThisMonthAndYear(req.EmployeeId, req.dateTime);
            int days = UserHelper.GetTotalDayInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var hoursWorkingInMonth = days * 8;
            var startDate = new DateTime(req.dateTime.Year, req.dateTime.Month, 1);
            var totalDays = DateTime.DaysInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var startDateOfMonth = new DateTime(req.dateTime.Year, req.dateTime.Month, 1);
            var lastDateOfMonth = new DateTime(req.dateTime.Year, req.dateTime.Month, totalDays);
            var listIdPayroll = new List<int>();
            if (contractInMonth.Count > 0)
            {
                foreach (var contract in contractInMonth)
                {
                    var payroll = new PayRoll();
                    payroll.StartDate = startDateOfMonth;
                    payroll.EndDate = lastDateOfMonth;
                    payroll.ContractId = contract.Id;
                    payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                    payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                    payroll.Bonus = 0;
                    payroll.BaseWorkingHours = hoursWorkingInMonth;

                    if (contract.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                    {
                        var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                        payroll.BaseSalaryPerHours = contract.BaseSalary / hoursWorkingInMonth;
                        payroll.TotalDeductionRate = contract.TaxRate + contract.InsuranceRate;
                        payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours + (payroll.BaseSalaryPerHours * ((decimal)contract.OTSalaryRate / 100));
                        payroll.DayOfHasSalary = dayTakeLeave;
                        payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);
                    }
                    else
                    {
                        payroll.BaseSalaryPerHours = contract.BaseSalary;
                        payroll.TotalDeductionRate = contract.TaxRate + contract.InsuranceRate;
                        payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                        payroll.DayOfHasSalary = 0;
                        payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                    }
                    if (contract.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                    {
                        payroll.Total -= (payroll.Total * ((decimal)payroll.TotalDeductionRate / 100));
                    }
                    listIdPayroll.Add(PayrollDAO.CreatePayroll(payroll).Id);
                    startDate = contract.EndDate.Date.AddDays(1);
                }
            }
            return listIdPayroll;
        }

        public void DeletePayroll(PayRoll payRoll)
        {
            PayrollDAO.DeletePayroll(payRoll);
        }

        public List<PayRoll> GetAllPayrolls()
        {
            return PayrollDAO.GetAll();
        }

        public List<PayRoll> GetListPayrollByEmpId(int empId)
        {
            return PayrollDAO.GetPayRollByEmployeeId(empId);
        }

        public PayRoll GetPayRollById(int id)
        {
            return PayrollDAO.FindPayrollById(id);
        }

        public void UpdatePayroll(PayRoll payroll)
        {
            PayrollDAO.UpdateStatusPayroll(payroll);
        }
    }
}
