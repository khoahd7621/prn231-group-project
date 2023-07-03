using BusinessObject;
using BusinessObject.Enum;
using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;
using System.Globalization;

namespace ITManagementSystemWebAPI.Controllers
{
    public class AttendanceController : ODataController
    {
        private readonly IAttendanceRepository attendanceRepository = new AttendaceReposiory();

        [EnableQuery]
        public IActionResult Get() => Ok(attendanceRepository.GetAttendences());

        [EnableQuery]
        public ActionResult<Attendance> Get(int key)
        {
            var item = attendanceRepository.FindAttendanceById(key);

            if (item == null) return NotFound();

            return Ok(item);
        }

        public ActionResult Post([FromBody] AttendanceReq attendanceRq)
        {
            try
            {

                var tempAttendace = attendanceRepository.FindAttendanceByUserAndDay(attendanceRq.EmployeeId, attendanceRq.Date.Date);

                if (tempAttendace != null)
                    return BadRequest("Attendance already exists.");

                var current = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(attendanceRq.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
                var now = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
                if (current < now) return Conflict("Date time create is out!");

                Attendance newAttendance = new Attendance
                {
                    Date = attendanceRq.Date,
                    Hour = attendanceRq.Hour,
                    OTHour = attendanceRq.OTHour,
                    Type = attendanceRq.Type,
                    EmployeeId = attendanceRq.EmployeeId
                };
                attendanceRepository.SaveAttendance(newAttendance);
                return Created(newAttendance);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        public IActionResult Put(int key, [FromBody] AttendanceReq attendanceReq)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);

            if (attendance == null)                return NotFound();

            var current = CultureInfo.CurrentCulture.Calendar
                .GetWeekOfYear(attendanceReq.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            var now = CultureInfo.CurrentCulture.Calendar
                .GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            if (current < now) return Conflict("Date time create is out!");

            attendance.Date = attendanceReq.Date;
            attendance.Hour = attendanceReq.Hour;
            attendance.OTHour = attendanceReq.OTHour;
            attendance.Type = attendanceReq.Type;
            attendance.EmployeeId = attendanceReq.EmployeeId;

            attendanceRepository.UpdateAttendance(attendance);

            return Updated(attendance);
        }

        public IActionResult Delete(int key)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);
            if (attendance == null)
                return NotFound();
            attendanceRepository.DeleteAttendance(attendance);
            return NoContent();
        }

        public IActionResult Patch(int key, EnumList.AttendanceStatus attendanceStatus)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);

            if (attendance == null)
                return NotFound();

            attendanceRepository.UpdateStatusAttendance(key, attendanceStatus);
            return Ok();
        }
    }
}
