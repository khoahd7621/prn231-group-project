using DataTransfer.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Repositories.Helper;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    [Route("odata/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IAuthenticationRepository authenticationRepository = new AuthenticationRepository();
        private IEmployeeRepository employeeRepository = new EmployeeRepository();

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDTO loginDTO)
        {
            var check = authenticationRepository.Login(loginDTO);
            return check.Equals("false") ? BadRequest("Wrong email & password") : Ok(check);
        }

        [Authorize]
        [HttpGet("Profile")]
        public IActionResult GetProfile()
        {
            string token = HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid token");
            if (token.StartsWith("Bearer "))
                token = token.Substring("Bearer ".Length).Trim();
            var employeeLogged = authenticationRepository.GetProfile(token);
            return Ok(employeeLogged);
        }

        [Authorize]
        [HttpPatch("ChangePassword")]
        public IActionResult ChangePassword(ChangePasswordReq req)
        {
            string token = HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid token");
            if (token.StartsWith("Bearer "))
                token = token.Substring("Bearer ".Length).Trim();
            var employeeid = UserHelper.GetEmployeeIdFromToken(token);
            var checkEmployeeIsFirstLogin = employeeRepository.GetEmployeeById(employeeid).IsFirstLogin;
            if (checkEmployeeIsFirstLogin)
                return BadRequest("This user not allow to use this api");
            var check = authenticationRepository.ChangePassword(employeeid, req);
            return check ? Ok() : BadRequest("Confirm password not match password");
        }

        [Authorize]
        [HttpPatch("FirstChangePassword")]
        public IActionResult FirstChangePassword(FirstChangePasswordReq req)
        {
            string token = HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid token");
            if (token.StartsWith("Bearer "))
                token = token.Substring("Bearer ".Length).Trim();
            var employeeid = UserHelper.GetEmployeeIdFromToken(token);
            var checkEmployeeIsFirstLogin = employeeRepository.GetEmployeeById(employeeid).IsFirstLogin;
            if (!checkEmployeeIsFirstLogin)
                return BadRequest("This user not allow to use this api");
            authenticationRepository.FirstChangePassword(employeeid, req);
            return Ok();
        }
    }
}
