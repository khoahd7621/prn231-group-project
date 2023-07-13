using AutoMapper;
using BusinessObject;
using DataTransfer.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;

namespace ITManagementSystemWebAPI.Controllers
{
    [Authorize]
    public class TakeLeaveController : ODataController
    {
        private readonly ITakeLeaveRepository takeLeaveRepository;
        private readonly IMapper _mapper;

        public TakeLeaveController(ITakeLeaveRepository takeLeaveRepository, IMapper mapper)
        {
            this.takeLeaveRepository = takeLeaveRepository;
            _mapper = mapper;
        }

        [EnableQuery]
        public IActionResult Get() => Ok(takeLeaveRepository.GetTakeLeaves());
        
        [EnableQuery]
        public ActionResult<Position> Get([FromRoute] int key)
        {
            var item = takeLeaveRepository.GetTakeLeaveById(key);

            if (item == null) return NotFound();

            return Ok(item);
        }

        public ActionResult Post([FromBody] TakeLeaveReq postTakeLeave)
        {
            var tempContract = takeLeaveRepository.GetActiveContractByEmployeeIdEqual(postTakeLeave.EmployeeId);
            if (tempContract == null)
            {
                return BadRequest("Require at least 1 active contract to create leave!");
            }
            if (postTakeLeave.Category.Equals(TakeLeaveCategory.ONE_DAY_LEAVE))
            {
                postTakeLeave.EndDate = postTakeLeave.StartDate;
            }
            if (!postTakeLeave.StartDate.Year.Equals(postTakeLeave.EndDate.Year))
            {
                return BadRequest("Please provide the start day and end date within the same calendar year. This will help us accurately calculate the duration leave of your request. Thank you!");
            }
            if (takeLeaveRepository.existApprovedAttendanceByDateEqualAndEmployeeEqual(postTakeLeave.EmployeeId, postTakeLeave.StartDate, postTakeLeave.EndDate))
            {
                return BadRequest("An attendance record already exists for the selected leave period.");
            }
            if (postTakeLeave.StartDate > postTakeLeave.EndDate)
            {
                DateTime temp = postTakeLeave.StartDate;
                postTakeLeave.StartDate = postTakeLeave.EndDate;
                postTakeLeave.EndDate = temp;
            }
            var tempTakeLeave = takeLeaveRepository.GetTakeLeaveByDateBetweenAndEmployeeIdEqual(postTakeLeave.StartDate, postTakeLeave.EndDate, postTakeLeave.EmployeeId);
            if (tempTakeLeave != null)
            {
                return BadRequest("Another Leave request has already been approved for the same time period!");
            }
            int leaveDays = takeLeaveRepository.CalculateLeaveDays(postTakeLeave.StartDate, postTakeLeave.EndDate);
            if (leaveDays <= 0)
            {
                return BadRequest("Leave request cannot be created as there are no leave days!");
            }
            if (postTakeLeave.Type.Equals(TakeLeaveType.ANNUAL_LEAVE))
            {
                int leaveBalance = tempContract.DateOffPerYear - takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndYearEqual(postTakeLeave.EmployeeId, postTakeLeave.StartDate.Year);
                if (leaveBalance < leaveDays)
                {
                    return BadRequest($"Don't have enough ANNUAL LEAVE to create Leave!(need: {leaveDays}, available: {leaveBalance})");
                }
            }
            var _mappedTakeLeave = _mapper.Map<TakeLeave>(postTakeLeave);
            _mappedTakeLeave.Status = TakeLeaveStatus.WAITING;
            _mappedTakeLeave.LeaveDays = leaveDays;
            takeLeaveRepository.SaveTakeLeave(_mappedTakeLeave);

            return Created(_mappedTakeLeave);
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute] int key, [FromBody] TakeLeaveReq postTakeLeave)
        {
            var tempContract = takeLeaveRepository.GetActiveContractByEmployeeIdEqual(postTakeLeave.EmployeeId);
            if (tempContract == null)
            {
                return BadRequest("Require at least 1 active contract to edit leave!");
            }
            var takeLeave = takeLeaveRepository.GetTakeLeaveById(key);

            if (takeLeave == null)
            {
                return NotFound();
            }
            int leaveDays = takeLeaveRepository.CalculateLeaveDays(postTakeLeave.StartDate, postTakeLeave.EndDate);
            if (postTakeLeave.Status.Equals(TakeLeaveStatus.APPROVED))
            {
                var tempTakeLeave = takeLeaveRepository.GetTakeLeaveByDateBetweenAndEmployeeIdEqual(postTakeLeave.StartDate, postTakeLeave.EndDate, postTakeLeave.EmployeeId);
                if (tempTakeLeave != null)
                {
                    return BadRequest("Another Leave request has already been approved for the same time period!");
                }
                if (postTakeLeave.Type.Equals(TakeLeaveType.ANNUAL_LEAVE))
                {
                    int leaveBalance = tempContract.DateOffPerYear - takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndYearEqual(postTakeLeave.EmployeeId, postTakeLeave.StartDate.Year);
                    if (leaveBalance < leaveDays)
                    {
                        return BadRequest($"Don't have enough ANNUAL LEAVE to edit Leave!(need: {leaveDays}, available: {leaveBalance})");
                    }
                }
                if (takeLeaveRepository.existApprovedAttendanceByDateEqualAndEmployeeEqual(postTakeLeave.EmployeeId, postTakeLeave.StartDate, postTakeLeave.EndDate))
                {
                    return BadRequest("An attendance record already exists for the selected leave period.");
                }

            }
            var _mappedTakeLeave = _mapper.Map<TakeLeave>(postTakeLeave);
            _mappedTakeLeave.Id = key;
            _mappedTakeLeave.LeaveDays = leaveDays;
            takeLeaveRepository.UpdateTakeLeave(_mappedTakeLeave);
            return Updated(_mappedTakeLeave);
        }

        public ActionResult Delete([FromRoute] int key)
        {
            var takeLeave = takeLeaveRepository.GetTakeLeaveById(key);
            if (takeLeave == null)
            {
                return NotFound();
            }
            takeLeaveRepository.DeleteTakeLeave(takeLeave);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Patch([FromRoute] int key, [FromBody] Delta<TakeLeave> delta)
        {
            var takeLeave = takeLeaveRepository.GetTakeLeaveById(key);
            if (takeLeave == null)
            {
                return NotFound();
            }
            delta.Patch(takeLeave);
            var tempContract = takeLeaveRepository.GetActiveContractByEmployeeIdEqual(takeLeave.EmployeeId);
            if (tempContract == null)
            {
                return BadRequest("Require at least 1 active contract to edit leave!");
            }
            if (delta.TryGetPropertyValue("StartDate", out var _startDate) || delta.TryGetPropertyValue("EndDate", out var _endDate))
            {
                int leaveDays = takeLeaveRepository.CalculateLeaveDays(takeLeave.StartDate, takeLeave.EndDate);
                takeLeave.LeaveDays = leaveDays;
            }
            if (takeLeave.Status.Equals(TakeLeaveStatus.APPROVED))
            {
                var tempTakeLeave = takeLeaveRepository.GetTakeLeaveByDateBetweenAndEmployeeIdEqual(takeLeave.StartDate, takeLeave.EndDate, takeLeave.EmployeeId);
                if (tempTakeLeave != null)
                {
                    return BadRequest("Another Leave request has already been approved for the same time period!");
                }
                if (takeLeave.Type.Equals(TakeLeaveType.ANNUAL_LEAVE))
                {
                    int leaveBalance = tempContract.DateOffPerYear - takeLeaveRepository.CalculateLeaveDaysByEmployeeIdEqualAndYearEqual(takeLeave.EmployeeId, takeLeave.StartDate.Year);
                    if (leaveBalance < takeLeave.LeaveDays)
                    {
                        return BadRequest($"Don't have enough ANNUAL LEAVE to edit Leave!(need: {takeLeave.LeaveDays}, available: {leaveBalance})");
                    }
                }
                if (takeLeaveRepository.existApprovedAttendanceByDateEqualAndEmployeeEqual(takeLeave.EmployeeId, takeLeave.StartDate, takeLeave.EndDate))
                {
                    return BadRequest("An attendance record already exists for the selected leave period.");
                }
            }
            takeLeaveRepository.UpdateTakeLeave(takeLeave);
            return Ok(takeLeave);
        }

    }
}
