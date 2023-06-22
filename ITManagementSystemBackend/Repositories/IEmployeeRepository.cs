using BusinessObject;
using BusinessObject.DTO;

namespace Repositories
{
    public interface IEmployeeRepository
    {
        public string createUser(EmployeeDTO employee);
        public List<Employee> GetAll();
    }
}
