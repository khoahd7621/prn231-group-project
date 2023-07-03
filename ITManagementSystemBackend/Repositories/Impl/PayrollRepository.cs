﻿using BusinessObject;
using DataAccess;
using DataTransfer.Request;
using Repositories.Helper;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Repositories.Impl
{
    public class PayrollRepository : IPayrollRepository
    {
        private ITakeLeaveRepository takeLeaveRepository;
        public PayrollRepository(ITakeLeaveRepository takeLeaveRepository)
        {
            this.takeLeaveRepository = takeLeaveRepository;
        }

        public bool CreatePayroll(PayrollReq req)
        {
            
            var contractActiveOfThisEmployee = ContractDAO.checkEmployeeHasAnyActiveContract(req.EmployeeId);
            var contractInMonth = ContractDAO.CheckEmployeeHasAnyContractOfThisMonth(req.EmployeeId, req.dateTime);
            int days = UserHelper.GetTotalDayInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var hoursWorkingInMonth = days * 8;
            var startDate = new DateTime(req.dateTime.Year, req.dateTime.Month, 1);
            var totalDays = DateTime.DaysInMonth(req.dateTime.Date.Year, req.dateTime.Date.Month);
            var lastDate = new DateTime(req.dateTime.Year, req.dateTime.Month, totalDays);
            if (contractInMonth != null)
            {
                foreach (var contract in contractInMonth)
                {
                    var payroll = new PayRoll();
                    payroll.EmployeeId = req.EmployeeId;
                    if (contract.Status == BusinessObject.Enum.EnumList.ContractStatus.Expired)
                    {

                        if (contract.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                        {
                            var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, contract.EndDate.Date);
                            payroll.BaseSalaryPerHours = contract.BaseSalary / hoursWorkingInMonth;
                            payroll.Tax = contract.TaxRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                            payroll.DayOfHasSalary = dayTakeLeave;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = hoursWorkingInMonth; //check tu hour in attendance
                            payroll.OTWorkingHours = hoursWorkingInMonth; // check tu OT in attendance
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);
                            PayrollDAO.CreatePayroll(payroll);
                        }
                        else
                        {
                            payroll.BaseSalaryPerHours = contract.BaseSalary;
                            payroll.Tax = contract.TaxRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                            payroll.DayOfHasSalary = 0;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = hoursWorkingInMonth; //check tu hour in attendance
                            payroll.OTWorkingHours = hoursWorkingInMonth; // check tu OT in attendance
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                            PayrollDAO.CreatePayroll(payroll);
                        }
                        // check Net va Gross
                        startDate = contract.EndDate.Date;
                    }
                    else if (contract.Status == BusinessObject.Enum.EnumList.ContractStatus.Active)
                    {
                        if (contract.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                        {
                            var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, lastDate.Date);
                            payroll.BaseSalaryPerHours = contract.BaseSalary / hoursWorkingInMonth;
                            payroll.Tax = contract.TaxRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                            payroll.DayOfHasSalary = dayTakeLeave;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = hoursWorkingInMonth; //check tu hour in attendance
                            payroll.OTWorkingHours = hoursWorkingInMonth; // check tu OT in attendance
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);
                            PayrollDAO.CreatePayroll(payroll);
                        }
                        else
                        {
                            payroll.BaseSalaryPerHours = contract.BaseSalary;
                            payroll.Tax = contract.TaxRate;
                            payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                            payroll.DayOfHasSalary = 0;
                            payroll.BaseWorkingHours = hoursWorkingInMonth;
                            payroll.RealWorkingHours = hoursWorkingInMonth; //check tu hour in attendance
                            payroll.OTWorkingHours = hoursWorkingInMonth; // check tu OT in attendance
                            payroll.Bonus = 0;
                            payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                            PayrollDAO.CreatePayroll(payroll);
                        }
                    }

                }
            }else if(contractActiveOfThisEmployee !=null)
            {
                var payroll = new PayRoll();
                payroll.EmployeeId = req.EmployeeId;
                if (contractActiveOfThisEmployee.EmployeeType == BusinessObject.Enum.EnumList.EmployeeType.FullTime)
                {
                    var dayTakeLeave = takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(req.EmployeeId, startDate.Date, lastDate.Date);
                    payroll.BaseSalaryPerHours = contractActiveOfThisEmployee.BaseSalary / hoursWorkingInMonth;
                    payroll.Tax = contractActiveOfThisEmployee.TaxRate;
                    payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                    payroll.DayOfHasSalary = dayTakeLeave;
                    payroll.BaseWorkingHours = hoursWorkingInMonth;
                    payroll.RealWorkingHours = hoursWorkingInMonth; //check tu hour in attendance
                    payroll.OTWorkingHours = hoursWorkingInMonth; // check tu OT in attendance
                    payroll.Bonus = 0;
                    payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, dayTakeLeave, payroll.Bonus);
                    PayrollDAO.CreatePayroll(payroll);
                }
                else
                {
                    payroll.BaseSalaryPerHours = contractActiveOfThisEmployee.BaseSalary;
                    payroll.Tax = contractActiveOfThisEmployee.TaxRate;
                    payroll.OTSalaryPerHours = payroll.BaseSalaryPerHours;
                    payroll.DayOfHasSalary = 0;
                    payroll.BaseWorkingHours = hoursWorkingInMonth;
                    payroll.RealWorkingHours = hoursWorkingInMonth; //check tu hour in attendance
                    payroll.OTWorkingHours = hoursWorkingInMonth; // check tu OT in attendance
                    payroll.Bonus = 0;
                    payroll.Total = UserHelper.TotalPayroll(payroll.BaseSalaryPerHours, (decimal)payroll.RealWorkingHours, payroll.OTSalaryPerHours, (decimal)payroll.OTWorkingHours, 0, payroll.Bonus);
                    PayrollDAO.CreatePayroll(payroll);
                }
            }
            else
            {
                return false;
            }
            return true;
        }
    }
}
