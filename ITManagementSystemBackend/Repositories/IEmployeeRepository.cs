using BusinessObject;
using BusinessObject.DTO;
using DataTransfer.Request;
using DataTransfer.Response;

namespace Repositories
{
    public interface IEmployeeRepository
    {
        public string createUser(EmployeeReq employee);
        public List<EmployeeResponse> GetAll();
        public bool updateUser(int id, EmployeeUpdateDTO employee);

        public void deleteUser(int id);
        public Employee GetEmployeeById(int id);
    }
}
