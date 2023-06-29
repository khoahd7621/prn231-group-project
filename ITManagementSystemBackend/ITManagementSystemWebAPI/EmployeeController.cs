

using BusinessObject.DTO;
using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI
{

    public class EmployeeController : ODataController
    {
        private IEmployeeRepository employeeRepository = new EmployeeRepository();
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
            var check = employeeRepository.createUser(employee);
            return check == "success" ? Ok() : BadRequest("Email already exist");
        }
        [HttpPut("odata/Employee/{id}")]
        public IActionResult Put(int id, [FromBody] EmployeeUpdateDTO employee)
        {
            var check = employeeRepository.updateUser(id, employee);
            return check ? Ok() : BadRequest();
        }
        [HttpDelete("odata/Employee/{id}")]
        public IActionResult Delete(int id)
        {
            var checkEmp = employeeRepository.GetEmployeeById(id);
            if (checkEmp == null)
            {
                return NotFound("Employee Not Found !!!");
            }
            var check = employeeRepository.deleteUser(id);
            
            return check ? Ok() : BadRequest("This employee has any contract just deactive");
        }
        [HttpPatch("odata/Employee/Deactive/{id}")]
        public IActionResult Deactive(int id)
        {
            var checkEmp = employeeRepository.GetEmployeeById(id);
            if (checkEmp == null)
            {
                return NotFound("Employee Not Found !!!");
            }
            var check = employeeRepository.DeactiveEmployee(id);

            return check.Equals("1") ? Ok() : BadRequest(check);
        }
        [HttpPatch("odata/Employee/Active/{id}")]
        public IActionResult Active(int id)
        {
            var checkEmp = employeeRepository.GetEmployeeById(id);
            if (checkEmp == null)
            {
                return NotFound("Employee Not Found !!!");
            }
            employeeRepository.ActiveEmployee(id);

            return Ok() ;
        }

        //[HttpPost("odata/Employee/Login")]
        //public IActionResult Login([FromBody] Login loginForm)
        //{
        //    return Ok(employeeRepository.Login(loginForm));
        //}
    }
}
