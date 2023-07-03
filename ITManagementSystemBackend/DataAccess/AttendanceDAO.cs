using BusinessObject;
using BusinessObject.Enum;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class AttendanceDAO
    {
        public static List<Attendance> GetAttendences()
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Attendances.Include(s => s.User).ToList();
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

        public static Attendance FindAttendanceByUser(int userId)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Attendances.Include(s => s.User)
                        .SingleOrDefault(c => c.EmployeeId == userId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void SaveAttendance(Attendance Attendance)
        {
            try
            {
                Attendance.Status = EnumList.AttendanceStatus.Waiting;

                using (var context = new MyDbContext())
                {
                    //TakeLeave takeLeave = context.TakeLeaves.SingleOrDefault(
                    // c => c.Date.Date == Attendance.Date.Date
                    //&& c.Status == EnumList
                    //);
                    //if (takeLeave != null) throw new ArgumentException("Can not create attendence bs of employee allready have TakeLeave");
                    context.Attendances.Add(Attendance);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void UpdateAttendance(Attendance Attendance)
        {
            try
            {
                Attendance.Status = EnumList.AttendanceStatus.Waiting;

                var context = new MyDbContext();

                TakeLeave takeLeave = context.TakeLeaves.SingleOrDefault(
                   // c => c.Date.Date == Attendance.Date.Date
                   //&& c.Status == EnumList
                   );
                if (takeLeave != null) throw new ArgumentException("Can not create attendence bs of employee allready have TakeLeave");

                if (context.Users.SingleOrDefault(e => e.Id == Attendance.EmployeeId) == null) throw new Exception();

                context.Entry(Attendance).State = EntityState.Modified;
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
        public static List<Attendance> GetAllAttendancesByEmployeeIdInMonth(int employeeId,DateTime date)
        {
            var context = new MyDbContext();
            return context.Attendances.Where(x=> x.EmployeeId==employeeId && (x.Date.Month==date.Month && x.Date.Year==date.Date.Year) && x.Status==EnumList.AttendanceStatus.Approved).ToList();
        }
    }
}
