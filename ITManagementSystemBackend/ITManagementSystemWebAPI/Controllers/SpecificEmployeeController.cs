using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Helper;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    [Authorize]
    public class SpecificEmployeeController : ODataController
    {
        private readonly IEmployeeRepository employeeRepository = new EmployeeRepository();

        [EnableQuery]
        public IActionResult Get()
        {
            string token = HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid token");
            if (token.StartsWith("Bearer "))
                token = token.Substring("Bearer ".Length).Trim();
            var employeeid = UserHelper.GetEmployeeIdFromToken(token);

            var check = employeeRepository.GetEmployeeById(employeeid);
            return check == null ? NotFound() : Ok(check);
        }
    }
}
