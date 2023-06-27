using AutoMapper;
using BusinessObject;
using BusinessObject.DTO;
using BusinessObject.Enum;
using DataAccess;
using DataTransfer.Request;

namespace Repositories.Impl
{
    public class EmployeeRepository : IEmployeeRepository
    {
        public string createUser(EmployeeReq employee)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<EmployeeReq, Employee>().ReverseMap());
            var mapper = new Mapper(config);
            Employee employeeReal = mapper.Map<Employee>(employee);
            var count = EmployeeDAO.CountEmployeeInCompany();
            var employeeCode = Helper.UserHelper.GeneratedEmployeeCode(count);
            employeeReal.EmployeeCode = employeeCode;
            employeeReal.IsFirstLogin = true;
            employeeReal.CreatedDate = DateTime.Now;
            employeeReal.EmployeeName = employee.LastName + " " + employee.FirstName;
            var password = Helper.UserHelper.GeneratedEmployeePassword(employeeReal.EmployeeName.ToLower(), employee.Dob);
            var employeeEmail = Helper.UserHelper.GeneratedEmployeeEmail(employeeReal.EmployeeName.ToLower());
            employeeReal.Email = employeeEmail;
            employeeReal.Password = password;
            employeeReal.Status = EnumList.EmployeeStatus.Active;
            EmployeeDAO.CreateEmployee(employeeReal);
            return "success";
        }

        public void deleteUser(int id)
        {
            var employee = EmployeeDAO.FindEmployeeById(id);
            employee.Status = EnumList.EmployeeStatus.Deleted;
            EmployeeDAO.UpdateEmployee(employee);
        }

        public List<Employee> GetAll()
        {
            return EmployeeDAO.GetAllEmployeeInCompany();
        }

        public Employee GetEmployeeById(int id)
        {
            return EmployeeDAO.FindEmployeeById(id);
        }

        public bool updateUser(int id,EmployeeUpdateDTO employee)
        {
            var employeeReal = EmployeeDAO.FindEmployeeById(id);
            if(employeeReal == null)
            {
                return false;
            }
            var config = new MapperConfiguration(cfg => cfg.CreateMap<EmployeeUpdateDTO, Employee>().ReverseMap());
            var mapper = new Mapper(config);
            mapper.Map(employee, employeeReal);
            EmployeeDAO.UpdateEmployee(employeeReal);
            return true;
        }   
    }
}
