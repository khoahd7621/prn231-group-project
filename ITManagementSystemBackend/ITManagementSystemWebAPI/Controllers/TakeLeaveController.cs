using BusinessObject;
using DataTransfer.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories.Impl;
using Repositories;
using AutoMapper;

namespace ITManagementSystemWebAPI.Controllers
{
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
            var tempTakeLeave = takeLeaveRepository.GetTakeLeaveByDateEqualAndEmployeeIdEqual(postTakeLeave.Date, postTakeLeave.EmployeeId);

            if (tempTakeLeave != null)
            {
                return BadRequest("Take Leave already exists!");
            }
            var _mappedTakeLeave = _mapper.Map<TakeLeave>(postTakeLeave);
            _mappedTakeLeave.Status = TakeLeaveStatus.WAITING;
            takeLeaveRepository.SaveTakeLeave(_mappedTakeLeave);

            return Created(_mappedTakeLeave);
        }

        public IActionResult Put([FromRoute] int key, [FromBody] TakeLeaveReq postTakeLeave)
        {
            var takeLeave = takeLeaveRepository.GetTakeLeaveById(key);

            if (takeLeave == null)
            {
                return NotFound();
            }
            var _mappedTakeLeave = _mapper.Map<TakeLeave>(postTakeLeave);
            _mappedTakeLeave.Id = key;
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
    }
}
