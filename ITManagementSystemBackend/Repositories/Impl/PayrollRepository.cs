using BusinessObject;
using DataAccess;
using DataTransfer.Request;
using Repositories.Helper;
using System.Diagnostics.Contracts;


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

        public List<int> CreatePayroll(PayrollReq req)
        {
            
            var contractActiveOfThisEmployee = ContractDAO.checkEmployeeHasAnyActiveContract(req.EmployeeId);
            var contractInMonth = ContractDAO.CheckEmployeeHasAnyContractOfThisMonth(req.EmployeeId, req.dateTime);
            int days = UserHelper.GetTotalDayInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var hoursWorkingInMonth = days * 8;
            var startDate = new DateTime(req.dateTime.Year, req.dateTime.Month, 1);
            var totalDays = DateTime.DaysInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var startDateOfMonth = new DateTime(req.dateTime.Year, req.dateTime.Month, 1);
            var lastDateOfMonth = new DateTime(req.dateTime.Year, req.dateTime.Month, totalDays);
            var lastDate = new DateTime(req.dateTime.Year, req.dateTime.Month, totalDays);
            var listIdPayroll = new List<int>();
            if (contractInMonth != null)
            {
                foreach (var contract in contractInMonth)
                {
                    var payroll = new PayRoll();
                    var check = true;
                    payroll.StartDate = startDateOfMonth;
                    payroll.EndDate = lastDateOfMonth;
                    payroll.ContractId = contract.Id;
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
                            if(dayTakeLeave== 0 && payroll.RealWorkingHours == 0)
                            {
                                check = false;
                            }
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
                            if (payroll.RealWorkingHours == 0)
                            {
                                check = false;
                            }
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);                  
                        }
                        if (contract.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                        {
                            payroll.Total -= (payroll.Total * ((decimal)payroll.Tax / 100));
                        }
                        if(check)
                            listIdPayroll.Add(PayrollDAO.CreatePayroll(payroll).Id);
                        check = true;
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
                            if (dayTakeLeave == 0 && payroll.RealWorkingHours == 0)
                            {
                                check = false;
                            }
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
                            if (payroll.RealWorkingHours == 0)
                            {
                                check = false;
                            }
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                            
                        }
                        if (contract.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                        {
                            payroll.Total -= (payroll.Total * ((decimal)payroll.Tax / 100));
                           

                        }
                        if(check)
                            listIdPayroll.Add(PayrollDAO.CreatePayroll(payroll).Id);
                        check = true;
                    }

                }
            }else if(contractActiveOfThisEmployee !=null)
            {
                var payroll = new PayRoll();
                var check = true;
                payroll.StartDate = startDateOfMonth;
                payroll.EndDate = lastDateOfMonth;
                payroll.ContractId = contractActiveOfThisEmployee.Id;
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
                    if (dayTakeLeave == 0 && payroll.RealWorkingHours == 0)
                    {
                        check = false;
                    }
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
                    if (payroll.RealWorkingHours == 0)
                    {
                        check = false;
                    }
                    payroll.Bonus = 0;
                    payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                    
                }
                if (contractActiveOfThisEmployee.SalaryType == BusinessObject.Enum.EnumList.SalaryType.Gross)
                {
                    payroll.Total -= (payroll.Total * ((decimal)payroll.Tax / 100));

                }
                if(check)
                    listIdPayroll.Add(PayrollDAO.CreatePayroll(payroll).Id);
                check = true;
            }
            else
            {
                return listIdPayroll;
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
