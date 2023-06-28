﻿using BusinessObject;
using BusinessObject.Enum;
using DataAccess;

namespace Repositories.Impl
{
    public class AttendaceReposiory : IAttendanceRepository
    {
        public void DeleteAttendance(Attendance Attendance) => AttendanceDAO.DeleteAttendance(Attendance);
        public Attendance FindAttendanceById(int attendanceId) => AttendanceDAO.FindAttendanceById(attendanceId);
        public Attendance FindAttendanceByUser(int userId) => AttendanceDAO.FindAttendanceByUser(userId);
        public List<Attendance> FindAttendanceByUserAndTime(int userId, DateTime timeBegin, DateTime timeEnd)
            => AttendanceDAO.FindAttendanceByUserAndTime(userId, timeBegin, timeEnd);
        public Attendance FindAttendanceByUserAndDay(int userId, DateTime time) => AttendanceDAO.FindAttendanceByUserAndDay(userId, time);
        public List<Attendance> GetAttendences() => AttendanceDAO.GetAttendences();
        public void SaveAttendance(Attendance Attendance) => AttendanceDAO.SaveAttendance(Attendance);
        public void UpdateStatusAttendance(int id, EnumList.AttendanceStatus attendanceStatus) => AttendanceDAO.UpdateStatusAttendance(id, attendanceStatus);
        public void UpdateAttendance(Attendance Attendance) => AttendanceDAO.UpdateAttendance(Attendance);
    }
}
