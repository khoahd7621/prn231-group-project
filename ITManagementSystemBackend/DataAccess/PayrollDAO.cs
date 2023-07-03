using BusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class PayrollDAO
    {
        public static void CreatePayroll(PayRoll payroll)
        {
            var context = new MyDbContext();
            context.Payrolls.Add(payroll);
            context.SaveChanges();
        }
    }
}
