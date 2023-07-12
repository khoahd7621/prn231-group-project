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
        public string CreateUser(EmployeeReq employee)
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
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            employeeReal.Role = EnumList.Role.Employee;
            employeeReal.Email = employeeEmail;
            employeeReal.Password = passwordHash;
            employeeReal.Status = EnumList.EmployeeStatus.Active;
            EmployeeDAO.CreateEmployee(employeeReal);
            return "success";
        }

        public List<Employee> GetAll()
        {
            return EmployeeDAO.GetAllEmployeeInCompany();
        }

        public Employee GetEmployeeById(int id)
        {
            return EmployeeDAO.FindEmployeeById(id);
        }

        public void ActiveEmployee(int id)
        {
            var employee = EmployeeDAO.FindEmployeeById(id);
            employee.Status = EnumList.EmployeeStatus.Active; EmployeeDAO.UpdateEmployee(employee);
        }

        public string DeactivateEmployee(int id)
        {
            var checkHasCurrentContract = ContractDAO.checkEmployeeHasAnyActiveContract(id);
            if (checkHasCurrentContract != null)
            {
                return "Should end contract first, then can deactivate this user";
            }
            var employee = EmployeeDAO.FindEmployeeById(id);

            employee.IsFirstLogin = true;
            employee.Password = Helper.UserHelper.GeneratedEmployeePassword(employee.EmployeeName.ToLower(), employee.Dob);
            employee.Status = EnumList.EmployeeStatus.Deactive;
            EmployeeDAO.UpdateEmployee(employee);
            return "1";
        }

        public bool UpdateUser(int id, EmployeeUpdateDTO employee)
        {
            var employeeReal = EmployeeDAO.FindEmployeeById(id);
            if (employeeReal == null)
            {
                return false;
            }
            var config = new MapperConfiguration(cfg => cfg.CreateMap<EmployeeUpdateDTO, Employee>().ReverseMap());
            var mapper = new Mapper(config);
            mapper.Map(employee, employeeReal);
            EmployeeDAO.UpdateEmployee(employeeReal);
            return true;
        }

        public bool DeleteUser(int id)
        {
            var employee = EmployeeDAO.FindEmployeeById(id);
            if (employee == null)
            {
                return false;
            }
            var checkHasAnyContract = ContractDAO.CheckEmployeeHaveAnyContract(id);
            if (checkHasAnyContract)
            {
                return false;
            }
            EmployeeDAO.DeleteEmployee(employee);
            return true;
        }

        public bool CheckCCCDIsExist(string cccd)
        {
            return EmployeeDAO.FindEmployeeByCCCD(cccd);
        }
    }
}
