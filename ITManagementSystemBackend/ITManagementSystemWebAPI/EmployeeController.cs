using BusinessObject.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;

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
            //var check = employeeRepository.GetEmployeeById(key);
            //return check == null ? NotFound() : Ok(check);
            return Ok();
        }

        public IActionResult Post([FromBody] EmployeeDTO employee)
        {
            var check = employeeRepository.createUser(employee);
            return check == "success" ? Ok() : BadRequest("Email already exist");
        }
        //[HttpPut("odata/Employee/{id}")]
        //public IActionResult Put(int id, [FromBody] EmployeeDTO employee)
        //{
        //    var check = employeeRepository.UpdateEmployee(id, employee);
        //    return check ? Ok() : BadRequest();
        //}
        //[HttpDelete("odata/Employee/{id}")]
        //public IActionResult Delete(int id)
        //{
        //    var check = employeeRepository.DeleteEmployee(id);
        //    return check ? Ok() : BadRequest();
        //}
        //[HttpPost("odata/Employee/Login")]
        //public IActionResult Login([FromBody] Login loginForm)
        //{
        //    return Ok(employeeRepository.Login(loginForm));
        //}
    }
}
