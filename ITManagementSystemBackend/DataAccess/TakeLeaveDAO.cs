using BusinessObject;

namespace DataAccess
{
    public class TakeLeaveDAO
    {
        public static List<TakeLeave> GetTakeLeaveHasSalaryByEmployeeIdAndStatusIsApprove(int empId, DateTime dateTime)
        {
            var context = new MyDbContext();
            var listTakeLeave = context.TakeLeaves.Where(x => x.EmployeeId == empId && (x.StartDate.Month == dateTime.Date.Month && x.StartDate.Date.Year == dateTime.Date.Year) && x.Status == TakeLeaveStatus.APPROVED).ToList();
            return listTakeLeave;
        }
    }
}
