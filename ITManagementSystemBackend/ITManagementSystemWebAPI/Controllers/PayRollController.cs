using BusinessObject.DTO;
using DataTransfer.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    public class PayRollController : ODataController
    {
        private readonly IPayrollRepository _payrollRepository;
public PayRollController(IPayrollRepository payrollRepository)
        {
            _payrollRepository = payrollRepository;
        }

        public IActionResult Post([FromBody] PayrollReq payrollReq)
        {
            var check = _payrollRepository.CreatePayroll(payrollReq);
            return Ok();
        }
    }
}
