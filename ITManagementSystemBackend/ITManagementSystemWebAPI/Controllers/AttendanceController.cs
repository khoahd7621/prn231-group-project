using BusinessObject;
using BusinessObject.Enum;
using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;
using System.Globalization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ITManagementSystemWebAPI.Controllers
{
    public class AttendanceController : ODataController
    {
        private readonly IAttendanceRepository attendanceRepository = new AttendaceReposiory();
        private readonly IEmployeeRepository employeeRepository = new EmployeeRepository();

        [EnableQuery]
        public IActionResult Get() => Ok(attendanceRepository.GetAttendences());
        public ActionResult<Attendance> Get(int key)
        {
            var item = attendanceRepository.FindAttendanceById(key);

            if (item == null) return NotFound();

            return Ok(item);
        }

        public ActionResult Post([FromBody] AttendanceReq attendanceRq)
        {
            var tempAttendace = attendanceRepository.FindAttendanceByUserAndDay(attendanceRq.EmployeeId, attendanceRq.Date.Date);

            if (tempAttendace != null)
            {
                return BadRequest("Attendace already exists.");
            }
            var current = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(attendanceRq.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            var now = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            if (current != now) return Conflict("Date time create is out!");

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

        public IActionResult Put(int key, [FromBody] AttendanceReq attendanceReq)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);

            if (attendance == null)
            {
                return NotFound();
            }

            var current = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(attendanceReq.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            var now = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            if (current != now) return Conflict("Date time create is out!");

          
                attendance.Date = attendanceReq.Date;
                attendance.Hour = attendanceReq.Hour;
                attendance.OTHour = attendanceReq.OTHour;
                attendance.Type = attendanceReq.Type;
                attendance.EmployeeId = attendanceReq.EmployeeId;
                //}
                //else return BadRequest();
        

            attendanceRepository.UpdateAttendance(attendance);

            return Updated(attendance);
        }
        public IActionResult Delete(int key)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);
            if (attendance == null)
            {
                return NotFound();
            }
            attendanceRepository.DeleteAttendance(attendance);
            return NoContent();
        }

        public IActionResult Patch(int key, EnumList.AttendanceStatus attendanceStatus)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);

            var current = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(attendance.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            var now = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.Now, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            if (current != now) return Conflict("Date time create is out!");

            if (attendance == null)
            {
                return NotFound();
            }

            if (attendance.Status == attendanceStatus)
            {
                return BadRequest("Change it staus");
            }

            attendanceRepository.UpdateStatusAttendance(key, attendanceStatus);
            return Ok();
        }
    }
}
