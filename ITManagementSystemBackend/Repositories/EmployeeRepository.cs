using AutoMapper;
using BusinessObject;
using BusinessObject.DTO;
using BusinessObject.Enum;
using DataAccess;

namespace Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        public string createUser(EmployeeDTO employee)
        {
            var check = EmployeeDAO.FindEmployeeByEmail(employee.Email);
            if (check != null)
            {
                return "Email Ready Exist";
            }
            var config = new MapperConfiguration(cfg => cfg.CreateMap<EmployeeDTO, Employee>().ReverseMap());
            var mapper = new Mapper(config);
            Employee employeeReal = mapper.Map<Employee>(employee);
            var count = EmployeeDAO.CountEmployeeInCompany();
            var employeeCode = Helper.UserHelper.GeneratedEmployeeCode(count);
            employeeReal.EmployeeCode = employeeCode;
            employeeReal.IsFirstLogin = true;
            employeeReal.EmployeeName = employee.LastName + " " + employee.FirstName;
            var password = Helper.UserHelper.GeneratedEmployeePassword(employeeReal.EmployeeName.ToLower(), employee.Dob);
            employeeReal.Password = password;
            employeeReal.Status = EnumList.EmployeeStatus.Active;
            EmployeeDAO.CreateEmployee(employeeReal);
            return "success";
        }

        public List<Employee> GetAll()
        {
            return EmployeeDAO.GetAllEmployeeInCompany();
        }
    }
}
