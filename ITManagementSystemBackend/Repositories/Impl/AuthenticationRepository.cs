using BusinessObject;
using BusinessObject.Enum;
using DataAccess;
using DataTransfer.Request;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Impl
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        


        public string Login(LoginDTO login)
        {
            var employee = EmployeeDAO.Login(login.Email, login.Password);
            if(employee == null)  return "false";
            string token = CreateToken(employee);
            return token;
        }
        private string CreateToken(Employee employee)
        {
            IConfigurationBuilder builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");

            var configuration = builder.Build();
            EnumList.Role role = employee.Role;
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Role,role.ToString()),
                new Claim(ClaimTypes.Sid,employee.Id.ToString()),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JWT:Token").Value!));
            var cread = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: cread
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
