using BusinessObject;

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

            return context.Payrolls.Where(x => x.contract.EmployeeId == EmployeeId).OrderBy(x => x.Id).ToList();
        }
        public static List<PayRoll> GetAll()
        {
            var context = new MyDbContext();
            return context.Payrolls.ToList();
        }
        public static PayRoll FindPayrollById(int Id)
        {
            var context = new MyDbContext();
            return context.Payrolls.FirstOrDefault(x => x.Id == Id);
        }
        public static void UpdateStatusPayroll(PayRoll payroll)
        {
            var context = new MyDbContext();
            context.Entry<PayRoll>(payroll).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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
