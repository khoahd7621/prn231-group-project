using BusinessObject.DTO;
using BusinessObject.Enum;
using DataTransfer.Request;
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

        [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] EmployeeReq employee)
        {
            var checkGenderIsDefined = !Enum.IsDefined(typeof(EnumList.Gender), employee.Gender);
            if (checkGenderIsDefined) return BadRequest("Role or Gender is not defined");
            var checkAgeOfEmployeeLessThan18 = UserHelper.CheckAgeLessThan18(employee.Dob);
            if (checkAgeOfEmployeeLessThan18) return BadRequest("Employee can't less than 18 years old");
            var checkCCCDAlreadyExist = employeeRepository.CheckCCCDIsExist(employee.CCCD);
            if (checkCCCDAlreadyExist) return BadRequest("CCCD already exist");
            var check = employeeRepository.CreateUser(employee);
            return check == "success" ? Ok() : BadRequest("Email already exist");
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute] int key, [FromBody] EmployeeUpdateDTO employee)
        {
            var check = employeeRepository.UpdateUser(key, employee);
            return check ? Ok() : BadRequest();
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpPatch("/odata/Employee/Deactivate/{key}")]
        public IActionResult Deactivate([FromRoute] int key)
        {
            var checkEmp = employeeRepository.GetEmployeeById(key);
            if (checkEmp == null)
                return NotFound();
            var check = employeeRepository.DeactivateEmployee(key);
            return check.Equals("1") ? Ok() : BadRequest(check);
        }

        [Authorize(Roles = "Admin")]
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
