using BusinessObject.DTO;
using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    public class EmployeeController : ODataController
    {
        private readonly IEmployeeRepository employeeRepository = new EmployeeRepository();
       
        [EnableQuery]
        public IActionResult Get()
        {
            return Ok(employeeRepository.GetAll());
        }

        [EnableQuery]
        public IActionResult Get([FromRoute] int key)
        {
            var check = employeeRepository.GetEmployeeById(key);
            return check == null ? NotFound() : Ok(check);
        }

        public IActionResult Post([FromBody] EmployeeReq employee)
        {
            var check = employeeRepository.CreateUser(employee);
            return check == "Success" ? Ok() : BadRequest("Email already exist");
        }

        public IActionResult Put([FromRoute] int key, [FromBody] EmployeeUpdateDTO employee)
        {
            var check = employeeRepository.UpdateUser(key, employee);
            return check ? Ok() : BadRequest();
        }

        public IActionResult Delete([FromRoute] int key)
        {
            var checkEmp = employeeRepository.GetEmployeeById(key);
            if (checkEmp == null)
            {
                return NotFound();
            }
            var check = employeeRepository.DeleteUser(key);

            return check ? Ok() : BadRequest("This employee has some contracts");
        }

        [HttpPatch("/odata/Employee/Deactivate/{key}")]
        public IActionResult Deactivate([FromRoute] int key)
        {
            var checkEmp = employeeRepository.GetEmployeeById(key);
            if (checkEmp == null)
                return NotFound();
            var check = employeeRepository.DeactivateEmployee(key);
            return check.Equals("1") ? Ok() : BadRequest(check);
        }

        [HttpPatch("/odata/Employee/Active/{key}")]
        public IActionResult Active([FromRoute] int key)
        {
            var checkEmp = employeeRepository.GetEmployeeById(key);
            if (checkEmp == null)
                return NotFound();
            employeeRepository.ActiveEmployee(key);
            return Ok();
        }
       
    }
}
