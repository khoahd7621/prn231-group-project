using BusinessObject;
using DataTransfer.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    public class PositionController : ODataController
    {
        private readonly IPositionRepository positionRepository = new PositionRepository();

        [EnableQuery]
        public IActionResult Get() => Ok(positionRepository.GetPositions());

        [EnableQuery]
        public ActionResult<Position> Get([FromRoute] int key)
        {
            var item = positionRepository.GetPositionById(key);

            if (item == null) return NotFound();

            return Ok(item);
        }

        public ActionResult Post([FromBody] PositionReq postPosition)
        {
            var tempPosition = positionRepository.GetPositionByName(postPosition.PositionName.Trim());

            if (tempPosition != null)
            {
                return BadRequest("Position already exists.");
            }

            Position position = new Position
            {
                PositionName = postPosition.PositionName.Trim()
            };

            positionRepository.SavePosition(position);

            return Created(position);
        }

        public IActionResult Put([FromRoute] int key, [FromBody] PositionReq postPosition)
        {
            var position = positionRepository.GetPositionById(key);

            if (position == null)
            {
                return NotFound();
            }

            if (!postPosition.PositionName.Trim().Equals(position.PositionName))
            {
                var tempPosition = positionRepository.GetPositionByName(postPosition.PositionName.Trim());

                if (tempPosition != null)
                {
                    return BadRequest("Position already exists.");
                }

                position.PositionName = postPosition.PositionName.Trim();
            }

            positionRepository.UpdatePosition(position);

            return Updated(position);
        }

        public ActionResult Delete([FromRoute] int key)
        {
            var position = positionRepository.GetPositionById(key);

            if (position == null)
            {
                return NotFound();
            }

            if (position.Contracts.Count > 0)
            {
                return BadRequest("Cannot delete position that already have contract");
            }

            positionRepository.DeletePosition(position);
            return NoContent();
        }
    }
}
