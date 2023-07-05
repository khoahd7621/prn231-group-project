using BusinessObject.Enum;
using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;

namespace ITManagementSystemWebAPI.Controllers
{
    public class PayRollController : ODataController
    {
        private readonly IPayrollRepository _payrollRepository;
        public PayRollController(IPayrollRepository payrollRepository)
        {
            _payrollRepository = payrollRepository;
        }
        [EnableQuery]
        public IActionResult Get()
        {
            return Ok(_payrollRepository.GetAllPayrolls());
        }
        [EnableQuery]
        public IActionResult Get([FromRoute] int key)
        {
            var check = _payrollRepository.GetPayRollById(key);
            return check == null ? NotFound() : Ok(check);
        }
        public IActionResult Post([FromBody] PayrollReq payrollReq)
        {
            var checkEmployeeHasAnyPayrollOfThisMonth = _payrollRepository.CheckEmployeeAlreadyHasPayroll(payrollReq.dateTime, payrollReq.EmployeeId);
            if (!checkEmployeeHasAnyPayrollOfThisMonth) return BadRequest("This user already has payroll");
            var check = _payrollRepository.CreatePayroll(payrollReq);
            return check != null ? Ok(check) : BadRequest("This User don't has any contract in this month");
        }
        [HttpPatch("odata/PayRoll/Approve/{key}")]
        public IActionResult Approve(int key)
        {
            var checkPayroll = _payrollRepository.GetPayRollById(key);
            if (checkPayroll == null) return BadRequest("This payroll not exist");
            if (checkPayroll.Status != EnumList.PayrollStatus.Waiting)
                return BadRequest("Status must be waiting");
            checkPayroll.Status = EnumList.PayrollStatus.Approved;
            _payrollRepository.UpdatePayroll(checkPayroll);
            return Ok("Approved");
        }
        [HttpPatch("odata/PayRoll/Reject/{key}")]
        public IActionResult Reject(int key)
        {
            var checkPayroll = _payrollRepository.GetPayRollById(key);
            if (checkPayroll == null) return BadRequest("This payroll not exist");
            if (checkPayroll.Status != EnumList.PayrollStatus.Waiting)
                return BadRequest("Status must be waiting");
            checkPayroll.Status = EnumList.PayrollStatus.Rejected;
            _payrollRepository.UpdatePayroll(checkPayroll);
            return Ok("Rejected");
        }
        [HttpPatch("odata/PayRoll/Delete/{key}")]
        public IActionResult Delete(int key)
        {
            var checkPayroll = _payrollRepository.GetPayRollById(key);
            if (checkPayroll == null) return BadRequest("This payroll not exist");
            if (checkPayroll.Status == EnumList.PayrollStatus.Approved)
                return BadRequest("Status must be different approved");
            checkPayroll.Status = EnumList.PayrollStatus.Deleted;
            _payrollRepository.UpdatePayroll(checkPayroll);
            return Ok("Deleted");
        }

    }
}
