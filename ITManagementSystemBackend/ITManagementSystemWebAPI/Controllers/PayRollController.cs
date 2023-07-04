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
        
    }
}
