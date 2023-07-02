using AutoMapper;
using BusinessObject;
using BusinessObject.Enum;
using DataAccess;
using DataTransfer.Request;
using DataTransfer.Response;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Repositories.Impl
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        public bool ChangePassword(int empId, ChangePasswordReq req)
        {
            var checkUser = EmployeeDAO.FindEmployeeById(empId);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
            if (!req.Password.Equals(req.ConfirmPassword))
                return false;
            checkUser.Password = passwordHash;
            EmployeeDAO.UpdateEmployee(checkUser);
            return true;
        }

        public bool FirstChangePassword(int empId, FirstChangePasswordReq req)
        {
            var checkUser = EmployeeDAO.FindEmployeeById(empId);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
            checkUser.Password = passwordHash;
            checkUser.IsFirstLogin = false;
            EmployeeDAO.UpdateEmployee(checkUser);
            return true;
        }

        public ProfileEmployeeResponse GetProfile(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claims = jwtToken.Claims;
            var idEmployee = claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value;
            var employeeLogged = EmployeeDAO.FindEmployeeById(int.Parse(idEmployee));
            var config = new MapperConfiguration(cfg => cfg.CreateMap<ProfileEmployeeResponse, Employee>().ReverseMap());
            var mapper = new Mapper(config);
            ProfileEmployeeResponse profile = mapper.Map<ProfileEmployeeResponse>(employeeLogged);
            return profile;
        }

        public string Login(LoginDTO login)
        {
            var employee = EmployeeDAO.Login(login.Email, login.Password);
            if (employee == null)
                return "false";
            if (employee.Status != EnumList.EmployeeStatus.Active)
                return "false";
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
                new Claim("EmployeeId",employee.Id.ToString()),
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
