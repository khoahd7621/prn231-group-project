using BusinessObject;

namespace DataAccess
{
    public class PayrollDAO
    {
        public static PayRoll CreatePayroll(PayRoll payroll)
        {
            var context = new MyDbContext();
            payroll.Status = BusinessObject.Enum.EnumList.PayrollStatus.Waiting;
            payroll.StartDate = DateTime.Now.Date;
            context.Payrolls.Add(payroll);
            context.SaveChanges();
            var createdPayroll = context.Payrolls.Find(payroll.Id);

            return createdPayroll;
        }
        public static List<PayRoll> GetPayRollByEmployeeId(int EmployeeId)
        {
            var context = new MyDbContext();
            return context.Payrolls.Where(x => x.EmployeeId == EmployeeId).ToList();
        }

    }
}
