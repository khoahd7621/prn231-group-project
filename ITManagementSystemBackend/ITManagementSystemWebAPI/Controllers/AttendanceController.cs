using BusinessObject;
using BusinessObject.Enum;
using DataTransfer.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Helper;
using Repositories.Impl;
using System.Globalization;

namespace ITManagementSystemWebAPI.Controllers
{
    [Authorize]
    public class AttendanceController : ODataController
    {
        private readonly IAttendanceRepository attendanceRepository = new AttendaceReposiory();

        [EnableQuery]
        public IActionResult Get() => Ok(attendanceRepository.GetAttendances());

        [EnableQuery]
        public ActionResult<Attendance> Get(int key)
        {
            var item = attendanceRepository.FindAttendanceById(key);

            if (item == null) return NotFound();

            return Ok(item);
        }
        [HttpPost("odata/AttendanceEmployee")]
        public IActionResult EmployeePost([FromBody] AttendanceEmployeeReq attendanceRq)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"];
                if (string.IsNullOrEmpty(token))
                    return BadRequest("Invalid token");
                if (token.StartsWith("Bearer "))
                    token = token.Substring("Bearer ".Length).Trim();
                var employeeid = UserHelper.GetEmployeeIdFromToken(token);
                var tempAttendace = attendanceRepository.FindAttendanceByUserAndDay(employeeid, attendanceRq.Date.Date);

                if (tempAttendace != null)
                    return BadRequest("Attendance already exists.");

                var current = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(attendanceRq.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
                var now = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
                if (current < now && attendanceRq.Date.Year < DateTime.Now.Year) return Conflict("Date time create is out!");

                Attendance newAttendance = new Attendance
                {
                    Date = attendanceRq.Date,
                    Hour = attendanceRq.Hour,
                    OTHour = attendanceRq.OTHour,
                    Type = attendanceRq.Type,
                    EmployeeId = employeeid
                };
                attendanceRepository.SaveAttendance(newAttendance);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
                if (current < now && attendanceRq.Date.Year < DateTime.Now.Year) return Conflict("Date time create is out!");

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
            try
            {
                var attendance = attendanceRepository.FindAttendanceById(key);

                if (attendance == null) return NotFound();

                var current = CultureInfo.CurrentCulture.Calendar
                    .GetWeekOfYear(attendanceReq.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
                var now = CultureInfo.CurrentCulture.Calendar
                    .GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
                if (current < now && attendanceReq.Date.Year < DateTime.Now.Year) return Conflict("Date time create is out!");

                attendance.Date = attendanceReq.Date;
                attendance.Hour = attendanceReq.Hour;
                attendance.OTHour = attendanceReq.OTHour;
                attendance.Type = attendanceReq.Type;
                attendance.EmployeeId = attendanceReq.EmployeeId;

                attendanceRepository.UpdateAttendance(attendance);


                return Updated(attendance);
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        public IActionResult Delete(int key)
        {
            try
            {

                var attendance = attendanceRepository.FindAttendanceById(key);
                if (attendance == null)
                    return NotFound();
                attendanceRepository.DeleteAttendance(attendance);
                return NoContent();
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Patch(int key, EnumList.AttendanceStatus attendanceStatus)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);

            if (attendance == null)
                return NotFound();
            try
            {
                attendanceRepository.UpdateStatusAttendance(key, attendanceStatus);
                return Ok();
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}