using BusinessObject;
using Microsoft.EntityFrameworkCore;
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
            var countEmployee = context.Users.Count();
            string patternNumber = @"\d+";
            if (countEmployee == 0)
            {
                return countEmployee;
            }
            var codeOfemployee = context.Users.OrderBy(x => x.Id).Last().EmployeeCode;
            Match match = Regex.Match(codeOfemployee, patternNumber);
            var lastCodeOfemployee = int.Parse(match.Value);
            return lastCodeOfemployee;
        }

        public static List<Employee> GetAllEmployeeInCompany()
        {
            var context = new MyDbContext();
            return context.Users
                .Include(u => u.Contracts)
                .ThenInclude(c => c.Position)
                .Include(u => u.Contracts)
                .ThenInclude(c => c.Level)
                .Include(u => u.Contracts)
                .ThenInclude(c => c.PayRolls)
                .ToList();
        }

        public static int CountEmailSameName(string email)
        {
            var context = new MyDbContext();
            var count = context.Users.Where(x => x.Email.Contains(email)).ToList();
            string pattern = @"[A-Za-z]";
            string patternNumber = @"\d+";
            if (count.Count == 0)
            {
                return 0;
            }
            List<Employee> listCheckEmail = new List<Employee>();
            var countEmail = 0;
            foreach (var item in count)
            {
                var emailcheck = item.Email.Split("@")[0];
                var emailWithoutNumber = string.Concat(Regex.Matches(emailcheck, pattern));
                if (email.Equals(emailWithoutNumber))
                {
                    listCheckEmail.Add(item);
                    countEmail++;
                }
            }
            if (countEmail == 0 || countEmail == 1)
            {
                return countEmail;
            }
            var lastEmail = listCheckEmail.OrderBy(x => x.Id).Last().Email;
            Match match = Regex.Match(lastEmail, patternNumber);
            var numberOfThisEmail = int.Parse(match.Value);
            return ++numberOfThisEmail;

        }

        public static void UpdateEmployee(Employee employee)
        {
            var context = new MyDbContext();
            context.Entry(employee).State = EntityState.Modified;
            context.SaveChanges();
        }

        public static Employee FindEmployeeById(int id)
        {
            var context = new MyDbContext();
            return context.Users
                .Include(u => u.Contracts)
                .ThenInclude(c => c.Position)
                .Include(u => u.Contracts)
                .ThenInclude(c => c.Level)
                .Include(u => u.Attendances)
                .Include(u => u.Contracts)
                .ThenInclude(c => c.PayRolls)
                .SingleOrDefault(x => x.Id == id);
        }

        public static void DeleteEmployee(Employee employee)
        {
            var context = new MyDbContext();
            context.Users.Remove(employee);
            context.SaveChanges();
        }

        public static Employee Login(string email, string password)
        {
            var context = new MyDbContext();
            var employee = context.Users.Where(c => c.Email.ToLower().Equals(email.ToLower())).FirstOrDefault();
            if (employee == null) return null;
            if (!BCrypt.Net.BCrypt.Verify(password, employee.Password)) return null;
            return employee;
        }

        public static bool FindEmployeeByCCCD(string cccd)
        {
            var context = new MyDbContext();
            var empl = context.Users.FirstOrDefault(x => x.CCCD.Equals(cccd));
            return empl != null;
        }
    }
}
