using BusinessObject;
using BusinessObject.Enum;

namespace Repositories
{
    public interface IAttendanceRepository
    {
        public List<Attendance> GetAttendances();
        public Attendance FindAttendanceById(int attendanceId);
        public List<Attendance> FindAttendanceByUserAndTime(int userId, DateTime timeBegin, DateTime timeEnd);
        public List<Attendance> FindAttendanceByUser(int userId);
        public Attendance FindAttendanceByUserAndDay(int userId, DateTime time);
        public void UpdateStatusAttendance(int id, EnumList.AttendanceStatus attendanceStatus);
        public void SaveAttendance(Attendance Attendance);
        public void UpdateAttendance(Attendance Attendance);
        public void DeleteAttendance(Attendance Attendance);

    }
}
