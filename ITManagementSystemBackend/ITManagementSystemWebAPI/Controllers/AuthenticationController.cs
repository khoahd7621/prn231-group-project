using DataTransfer.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IAuthenticationRepository authenticationRepository = new AuthenticationRepository();
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDTO loginDTO)
        {
            var check = authenticationRepository.Login(loginDTO);
            return check.Equals("false") ? BadRequest("Wrong email & password") : Ok(check);
        }
    }
}
