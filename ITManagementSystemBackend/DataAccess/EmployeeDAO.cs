using BusinessObject;

namespace DataAccess
{
    public class EmployeeDAO
    {
        public static void CreateEmployee(Employee employee)
        {
            var context = new MyDbContext();
            context.Users.Add(employee);
            context.SaveChanges();
        }
        public static Employee FindEmployeeByEmail(string email)
        {
            var context = new MyDbContext();
            return context.Users.Where(c => c.Email.ToLower().Equals(email.ToLower())).FirstOrDefault();
        }
        public static int CountEmployeeInCompany()
        {
            var context = new MyDbContext();
            return context.Users.Count();
        }
        public static List<Employee> GetAllEmployeeInCompany()
        {
            var context = new MyDbContext();
            var list = context.Users.ToList();
            return list;
        }
    }
}
