using BusinessObject;
using BusinessObject.Enum;

namespace Repositories
{
    public interface IAttendanceRepository
    {
        public List<Attendance> GetAttendences();
        public Attendance FindAttendanceById(int attendanceId);
        public List<Attendance> FindAttendanceByUserAndTime(int userId, DateTime timeBegin, DateTime timeEnd);
        public Attendance FindAttendanceByUserAndDay(int userId, DateTime time);
        public void UpdateStatusAttendance(int id, EnumList.AttendanceStatus attendanceStatus);
        public Attendance FindAttendanceByUser(int userId);
        public void SaveAttendance(Attendance Attendance);
        public void UpdateAttendance(Attendance Attendance);
        public void DeleteAttendance(Attendance Attendance);
    }
}
