using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories.Impl;
using Repositories;
using BusinessObject;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using DataTransfer.Request;
using BusinessObject.Enum;

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
            var tempAttendace = attendanceRepository.FindAttendanceByUserAndDay(attendanceRq.EmployeeId, attendanceRq.Date);

            if (tempAttendace != null)
            {
                return BadRequest("Attendace already exists.");
            }
            Attendance newAttendance = new Attendance
            {
                Date = attendanceRq.Date,
                Hour = attendanceRq.Hour,
                OTHour = attendanceRq.OTHour,
                Status = attendanceRq.Status,
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
            //var employee = employeeRepository.get
            if (attendance.Status != EnumList.AttendanceStatus.Deleted)
            {
                //if (DateTime.Parse(attendance.Date.ToString("yyyy-mm-dd")) == DateTime.Parse(attendanceReq.Date.ToString("yyyy-mm-dd"))) { 
                attendance.Date = attendanceReq.Date;
                attendance.Hour = attendanceReq.Hour;
                attendance.OTHour = attendanceReq.OTHour;
                attendance.Status = attendanceReq.Status;
                attendance.Type = attendanceReq.Type;
                attendance.EmployeeId = attendanceReq.EmployeeId;
                //}
                //else return BadRequest();
            }
            else
            {
                return BadRequest("Status it not delete");
            }

            attendanceRepository.UpdateAttendance(attendance);

            return Updated(attendance);
        }
        public IActionResult Patch(int key, EnumList.AttendanceStatus attendanceStatus)
        {
            var attendance = attendanceRepository.FindAttendanceById(key);

            if (attendance == null)
            {
                return NotFound();
            }

            if (attendance.Status == attendanceStatus)
            {
                return BadRequest("Cannot update status");
            }

            attendanceRepository.UpdateStatusAttendance(key, attendanceStatus);
            return Ok();
        }
    }
}
