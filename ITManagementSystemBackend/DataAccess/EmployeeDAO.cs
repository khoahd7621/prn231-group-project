using BusinessObject;
using System.Text.RegularExpressions;

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
        public static int CountEmailSameName(string email)
        {
            var context = new MyDbContext();
            var count = context.Users.Where(x => x.Email.Contains(email)).ToList();
            string pattern = @"[A-Za-z]";
            if (count.Count == 0)
            {
                return 0;
            }
            var countEmail = 0;
            foreach (var item in count)
            {
                var emailcheck = item.Email.Split("@")[0];
                var emailWithoutNumber = string.Concat(Regex.Matches(emailcheck, pattern));
                if (email.Equals(emailWithoutNumber))
                {
                    countEmail++;
                }
            }
            return countEmail;
        }
        public static void UpdateEmployee(Employee employee)
        {
            var context = new MyDbContext();
            context.Entry<Employee>(employee).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            context.SaveChanges();

        }
        public static Employee FindEmployeeById(int id)
        {
            var context = new MyDbContext();
            var employee = context.Users.SingleOrDefault(x => x.Id == id);
            return employee;
        }
        public static void DeleteEmployee(Employee employee)
        {
            var context = new MyDbContext();
            context.Users.Remove(employee);
            context.SaveChanges();
        }
    }
}
