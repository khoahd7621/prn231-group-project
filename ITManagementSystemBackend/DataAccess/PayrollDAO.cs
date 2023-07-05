using BusinessObject;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class PayrollDAO
    {
        public static PayRoll CreatePayroll(PayRoll payroll)
        {
            var context = new MyDbContext();
            payroll.Status = BusinessObject.Enum.EnumList.PayrollStatus.Waiting;
            payroll.CreatedDate = DateTime.Now.Date;
            context.Payrolls.Add(payroll);
            context.SaveChanges();
            return context.Payrolls.Find(payroll.Id);
        }

        public static List<PayRoll> GetPayRollByEmployeeId(int EmployeeId)
        {
            var context = new MyDbContext();

            return context.Payrolls.Where(x => x.Contract.EmployeeId == EmployeeId).OrderBy(x => x.Id).ToList();
        }

        public static List<PayRoll> GetAll()
        {
            var context = new MyDbContext();
            return context.Payrolls
                .Include(u => u.Contract)
                .ThenInclude(c => c.User)
                .Include(u => u.Contract)
                .ThenInclude(c => c.Position)
                .Include(u => u.Contract)
                .ThenInclude(c => c.Level)
                .ToList();
        }

        public static PayRoll FindPayrollById(int Id)
        {
            var context = new MyDbContext();
            return context.Payrolls
                .Include(u => u.Contract)
                .ThenInclude(c => c.User)
                .Include(u => u.Contract)
                .ThenInclude(c => c.Position)
                .Include(u => u.Contract)
                .ThenInclude(c => c.Level)
                .FirstOrDefault(x => x.Id == Id);
        }

        public static void UpdateStatusPayroll(PayRoll payroll)
        {
            var context = new MyDbContext();
            context.Entry(payroll).State = EntityState.Modified;
            context.SaveChanges();
        }
        public static void DeletePayroll(PayRoll payRoll)
        {
            var context = new MyDbContext();
            context.Payrolls.Remove(payRoll);
            context.SaveChanges();
        }

    }
}
