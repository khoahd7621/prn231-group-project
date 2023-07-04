using BusinessObject;
using DataAccess;
using DataTransfer.Request;
using DataTransfer.Response;
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
            if(listPayRollOfThisEmployee == null) return true;
            var checkList = new List<PayRoll>();
            foreach(var payroll in listPayRollOfThisEmployee)
            {
                if((payroll.StartDate.Date.Month == date.Date.Month && payroll.StartDate.Date.Year == date.Date.Year) && (payroll.Status == BusinessObject.Enum.EnumList.PayrollStatus.Approved || payroll.Status == BusinessObject.Enum.EnumList.PayrollStatus.Waiting))
                  checkList.Add(payroll);
            }
            if(checkList.Count ==0) return true;
            return false;
        }

        public List<ContractAndPayrollResponse> CreatePayroll(PayrollReq req)
        {
            
            var contractActiveOfThisEmployee = ContractDAO.checkEmployeeHasAnyActiveContract(req.EmployeeId);
            var contractInMonth = ContractDAO.CheckEmployeeHasAnyContractOfThisMonth(req.EmployeeId, req.dateTime);
            int days = UserHelper.GetTotalDayInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var hoursWorkingInMonth = days * 8;
            var startDate = new DateTime(req.dateTime.Year, req.dateTime.Month, 1);
            var totalDays = DateTime.DaysInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var lastDate = new DateTime(req.dateTime.Year, req.dateTime.Month, totalDays);
            var listContractAndPayrollReturn = new List<ContractAndPayrollResponse>();
            if (contractInMonth != null)
            {
                foreach (var contract in contractInMonth)
                {
                    var payroll = new PayRoll();
                    var contractAndPayroll = new ContractAndPayrollResponse();
                    payroll.StartDate = lastDate;
                    payroll.EmployeeId = req.EmployeeId;
                    if (contract.Status == BusinessObject.Enum.EnumList.ContractStatus.Expired)
                    {

                        if (contract.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                        {
                            var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.BaseSalaryPerHours = contract.BaseSalary / hoursWorkingInMonth;
                            payroll.Tax = contract.TaxRate + contract.InsuranceRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours + ( payroll.BaseSalaryPerHours * ((decimal)contract.OTSalaryRate / 100));
                            payroll.DayOfHasSalary = dayTakeLeave;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);                            
                        }
                        else
                        {
                            payroll.BaseSalaryPerHours = contract.BaseSalary;
                            payroll.Tax = contract.TaxRate + contract.InsuranceRate;
                            payroll.OTSalaryPerHours += payroll.BaseSalaryPerHours;
                            payroll.DayOfHasSalary = 0;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);                  
                        }
                        if (contract.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                        {
                            payroll.Total -= (payroll.Total * ((decimal)contract.InsuranceRate/100));
                            payroll.Total -= (payroll.Total * ((decimal)contract.TaxRate/100));

                        }
                        contractAndPayroll.Payroll= PayrollDAO.CreatePayroll(payroll);
                        contractAndPayroll.Contract = contract;
                        listContractAndPayrollReturn.Add(contractAndPayroll);

                        startDate = contract.EndDate.Date.AddDays(1);
                    }
                    else if (contract.Status == BusinessObject.Enum.EnumList.ContractStatus.Active)
                    {
                        if (contract.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                        {
                            var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, lastDate.Date);
                            payroll.BaseSalaryPerHours = contract.BaseSalary / hoursWorkingInMonth;
                            payroll.Tax = contract.TaxRate + contract.InsuranceRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours +(payroll.BaseSalaryPerHours * ((decimal)contract.OTSalaryRate / 100));
                            payroll.DayOfHasSalary = dayTakeLeave;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);
                            
                        }
                        else
                        {
                            payroll.BaseSalaryPerHours = contract.BaseSalary;
                            payroll.Tax = contract.TaxRate + contract.InsuranceRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                            payroll.DayOfHasSalary = 0;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, contract.EndDate.Date); 
                            payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                            
                        }
                        if (contract.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                        {
                            payroll.Total -= (payroll.Total * (decimal)contract.InsuranceRate);
                            payroll.Total -= (payroll.Total * (decimal)contract.TaxRate);

                        }
                        contractAndPayroll.Payroll = PayrollDAO.CreatePayroll(payroll);
                        contractAndPayroll.Contract = contract;
                        listContractAndPayrollReturn.Add(contractAndPayroll);
                    }

                }
            }else if(contractActiveOfThisEmployee !=null)
            {
                var payroll = new PayRoll();
                var contractAndPayroll = new ContractAndPayrollResponse();
                payroll.StartDate = lastDate;
                payroll.EmployeeId = req.EmployeeId;
                if (contractActiveOfThisEmployee.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                {
                    var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, lastDate.Date);
                    payroll.BaseSalaryPerHours = contractActiveOfThisEmployee.BaseSalary / hoursWorkingInMonth;
                    payroll.Tax = contractActiveOfThisEmployee.TaxRate + contractActiveOfThisEmployee.InsuranceRate;
                    payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours + (payroll.BaseSalaryPerHours * ((decimal)contractActiveOfThisEmployee.OTSalaryRate / 100));
                    payroll.DayOfHasSalary = dayTakeLeave;
                    payroll.BaseWorkingHours = hoursWorkingInMonth;
                    payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, lastDate.Date); 
                    payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, lastDate.Date);
                    payroll.Bonus = 0;
                    payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);
                    
                }
                else
                {
                    payroll.BaseSalaryPerHours = contractActiveOfThisEmployee.BaseSalary;
                    payroll.Tax = contractActiveOfThisEmployee.TaxRate + contractActiveOfThisEmployee.InsuranceRate;
                    payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                    payroll.DayOfHasSalary = 0;
                    payroll.BaseWorkingHours = hoursWorkingInMonth;
                    payroll.RealWorkingHours = AttendanceDAO.getHour(req.EmployeeId, startDate.Date, lastDate.Date); 
                    payroll.OTWorkingHours = AttendanceDAO.getOtHour(req.EmployeeId, startDate.Date, lastDate.Date);
                    payroll.Bonus = 0;
                    payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                    
                }
                if (contractActiveOfThisEmployee.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                {
                    payroll.Total -= (payroll.Total * ((decimal)contractActiveOfThisEmployee.InsuranceRate / 100));
                    payroll.Total -= (payroll.Total * ((decimal)contractActiveOfThisEmployee.TaxRate / 100));

                }
                contractAndPayroll.Payroll = PayrollDAO.CreatePayroll(payroll);
                contractAndPayroll.Contract = contractActiveOfThisEmployee;
                listContractAndPayrollReturn.Add(contractAndPayroll);
 
            }
            else
            {
                return null;
            }
            return listContractAndPayrollReturn;
        }
    }
}
