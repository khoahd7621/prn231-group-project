using BusinessObject;
using BusinessObject.DTO;
using DataTransfer.Request;

namespace Repositories
{
    public interface IEmployeeRepository
    {
        public string createUser(EmployeeReq employee);
        public List<Employee> GetAll();
        public bool updateUser(int id,EmployeeUpdateDTO employee);
    }
}
