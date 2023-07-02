using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Repositories.Impl;
using System.IdentityModel.Tokens.Jwt;

namespace ITManagementSystemWebAPI.Controllers
{
    [Route("api/[controller]")]
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
        [HttpGet("Profile")]
        public IActionResult GetProfile( string token)
        {
            var employeeLogged= authenticationRepository.GetProfile(token);
            return Ok(employeeLogged);
        }
        [HttpPatch("ChangePassword")]
        public IActionResult ChangePassword(ChangePasswordReq req) {
            string token = HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid token");
            if (token.StartsWith("Bearer ")) 
                token = token.Substring("Bearer ".Length).Trim();
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claims = jwtToken.Claims;
            var idEmployee = claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value;
            var checkEmployeeIsFirstLogin = employeeRepository.GetEmployeeById(int.Parse(idEmployee)).IsFirstLogin;
            if (checkEmployeeIsFirstLogin)
                return BadRequest("This user not allow to use this api");
            var check = authenticationRepository.ChangePassword(int.Parse(idEmployee), req);
            return check ? Ok() : BadRequest("Confirm password not match password");
        }
        [HttpPatch("FirstChangePassword")]
        public IActionResult FirstChangePassword(FirstChangePasswordReq req)
        {
            string token = HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid token");
            if (token.StartsWith("Bearer "))
                token = token.Substring("Bearer ".Length).Trim();
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claims = jwtToken.Claims;
            var idEmployee = claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value;
            var checkEmployeeIsFirstLogin = employeeRepository.GetEmployeeById(int.Parse(idEmployee)).IsFirstLogin;
            if (!checkEmployeeIsFirstLogin)
                return BadRequest("This user not allow to use this api");
            authenticationRepository.FirstChangePassword(int.Parse(idEmployee), req);
            return Ok();
        }
    }
}
