using BusinessObject;
using BusinessObject.Enum;
using Microsoft.EntityFrameworkCore;
using static BusinessObject.Enum.EnumList;

namespace DataAccess
{
    public class AttendanceDAO
    {
        public static List<Attendance> GetAttendances()
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Attendances.Include(s => s.User).OrderBy(c => c.Status).ToList();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public static Attendance FindAttendanceById(int attendanceId)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Attendances.Include(s => s.User)
                        .SingleOrDefault(c => c.Id == attendanceId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Attendance> FindAttendanceByUserAndTime(int userId, DateTime timeBegin, DateTime timeEnd)
        {
            try
            {
                List<Attendance> list = null;
                using (var context = new MyDbContext())
                {
                    list = context.Attendances
                       .Include(s => s.User)
                       .Where(c => c.EmployeeId == userId
                               & c.Date >= timeBegin
                               & c.Date <= timeEnd
                               ).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Attendance FindAttendanceByUserAndDay(int userId, DateTime time)
        {
            try
            {
                Attendance list = null;
                using (var context = new MyDbContext())
                {
                    list = context.Attendances
                       .Include(s => s.User)
                       .FirstOrDefault(c => c.EmployeeId == userId
                               & c.Date.Date == time);
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Attendance> FindAttendanceByUser(int userId)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Attendances.Include(s => s.User).ToList()
                        .Where(c => c.EmployeeId == userId).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void SaveAttendance(Attendance attendance)
        {
            try
            {
                if (attendance.Date.DayOfWeek == DayOfWeek.Sunday
                    || attendance.Date.DayOfWeek == DayOfWeek.Saturday)
                { throw new Exception("Can not create attendance at Sunday or Saturday"); }
                attendance.Status = EnumList.AttendanceStatus.Waiting;

                using (var context = new MyDbContext())
                {
                    List<TakeLeave> takeLeave = context.TakeLeaves
                        .Where(c => c.EmployeeId == attendance.EmployeeId
                        && c.Status.Equals(TakeLeaveStatus.APPROVED)
                        && (c.StartDate.Date <= attendance.Date.Date && attendance.Date.Date <= c.EndDate.Date)
                       || c.StartDate.Date == attendance.Date.Date
                        ).ToList();
                    if (takeLeave.Count != 0) throw new ArgumentException("Can not create attendance of employee already have TakeLeave");

                    var contract = context.Contracts
                        .Where(c => c.EmployeeId == attendance.EmployeeId
                        && c.Status.Equals(ContractStatus.Active)
                        //&& c.StartDate >= attendance.Date
                        && c.EndDate.Date >= attendance.Date.Date
                        ).ToList();
                    if (contract.Count == 0) throw new ArgumentException("Can not create attendance of employee's contract is not exist.");
                    context.Attendances.Add(attendance);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void UpdateAttendance(Attendance attendance)
        {
            try
            {
                if (attendance.Date.DayOfWeek == DayOfWeek.Sunday
                    || attendance.Date.DayOfWeek == DayOfWeek.Saturday)
                { throw new Exception("Can not create attendance at Sunday or Saturday"); }
                attendance.Status = EnumList.AttendanceStatus.Waiting;

                var context = new MyDbContext();

                List<TakeLeave> takeLeave = context.TakeLeaves
                       .Where(c => c.EmployeeId == attendance.EmployeeId
                       && c.Status.Equals(TakeLeaveStatus.APPROVED)
                       && (c.StartDate.Date <= attendance.Date.Date && attendance.Date.Date <= c.EndDate.Date)
                       || c.StartDate.Date == attendance.Date.Date
                       ).ToList();
                if (takeLeave.Count != 0)
                    throw new ArgumentException("Can not create attendance of employee already have TakeLeave");

                var contract = context.Contracts
                    .Where(c => c.EmployeeId == attendance.EmployeeId
                    && c.Status.Equals(ContractStatus.Active)
                    //&& c.StartDate >= attendance.Date
                    && c.EndDate.Date >= attendance.Date.Date
                    ).ToList();
                if (contract.Count == 0)
                    throw new ArgumentException("Can not create attendance of employee's contract is not exist");

                if (context.Users.SingleOrDefault(e => e.Id == attendance.EmployeeId) == null)
                    throw new Exception("Employee is not exist");

                context.Entry(attendance).State = EntityState.Modified;
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static void UpdateStatusAttendance(int id, EnumList.AttendanceStatus attendanceStatus)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    var attendance = context.Attendances.SingleOrDefault(c => c.Id == id);
                    attendance.Status = attendanceStatus;
                    List<TakeLeave> takeLeave = context.TakeLeaves
                       .Where(c => c.EmployeeId == attendance.EmployeeId
                       && c.Status.Equals(TakeLeaveStatus.APPROVED)
                       && (c.StartDate.Date <= attendance.Date.Date && attendance.Date.Date <= c.EndDate.Date)
                       || c.StartDate.Date == attendance.Date.Date
                       ).ToList();
                    if (takeLeave.Count() != 0)
                        throw new ArgumentException("Can not create attendance of employee already have TakeLeave");

                    var contract = context.Contracts
                        .Where(c => c.EmployeeId == attendance.EmployeeId
                        && c.Status.Equals(ContractStatus.Active)
                        //&& c.StartDate >= attendance.Date
                        && c.EndDate.Date >= attendance.Date.Date
                        ).ToList();
                    if (contract.Count() == 0) throw new ArgumentException("Can not create attendance of employee's contract is not exist");
                    context.Entry(attendance).State = EntityState.Modified;
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void DeleteAttendance(Attendance Attendance)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    context.Attendances.Remove(Attendance);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static List<Attendance> GetAllAttendancesByEmployeeIdInMonth(int employeeId, DateTime date)
        {
            var context = new MyDbContext();
            return context.Attendances.Where(x => x.EmployeeId == employeeId && (x.Date.Month == date.Month && x.Date.Year == date.Date.Year) && x.Status == EnumList.AttendanceStatus.Approved).ToList();
        }
        public static double getHour(int userId, DateTime timeBegin, DateTime timeEnd)
        {
            try
            {
                double hour = 0;
                List<Attendance> list = null;
                using (var context = new MyDbContext())
                {
                    list = context.Attendances
                       .Include(s => s.User)
                       .Where(c => c.EmployeeId == userId
                               & c.Date >= timeBegin
                               & c.Date <= timeEnd
                               & c.Status == AttendanceStatus.Approved
                               ).ToList();
                }
                hour = list.Sum(c => c.Hour);
                return hour;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static double getOtHour(int userId, DateTime timeBegin, DateTime timeEnd)
        {
            try
            {
                double hour = 0;
                List<Attendance> list = null;
                using (var context = new MyDbContext())
                {
                    list = context.Attendances
                       .Include(s => s.User)
                       .Where(c => c.EmployeeId == userId
                               & c.Date >= timeBegin
                               & c.Date <= timeEnd
                               & c.Status == AttendanceStatus.Approved
                               ).ToList();
                }
                hour = list.Sum(c => c.OTHour);
                return hour;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}