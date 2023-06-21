using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace ITManagementSystemWebAPI
{

    public class EmployeeController : ODataController
    {
        //private IEmployeeRepository employeeRepository = new EmployeeRepository();
        //[EnableQuery]
        //public IActionResult Get()
        //{
        //    return Ok(employeeRepository.GetAll());
        //}
        //[EnableQuery]
        //public IActionResult Get([FromRoute] int key)
        //{
        //    var check = employeeRepository.GetEmployeeById(key);
        //    return check == null ? NotFound() : Ok(check);
        //}

        //public IActionResult Post([FromBody] EmployeeDTO employee)
        //{
        //    var check = employeeRepository.CreateEmployee(employee);
        //    return check ? Ok() : BadRequest();
        //}
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
