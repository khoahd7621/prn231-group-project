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
    public class LevelController : ODataController
    {
        private readonly ILevelRepository levelRepository = new LevelRepository();

        [EnableQuery]
        public IActionResult Get() => Ok(levelRepository.GetLevels());

        [EnableQuery]
        public ActionResult<Level> Get([FromRoute] int key)
        {
            var item = levelRepository.GetLevelById(key);

            if (item == null) return NotFound();

            return Ok(item);
        }

        public ActionResult Post([FromBody] LevelReq postLevel)
        {
            var tempLevel = levelRepository.GetLevelByName(postLevel.LevelName.Trim());

            if (tempLevel != null)
            {
                return BadRequest("Level already exists.");
            }

            Level level = new Level
            {
                LevelName = postLevel.LevelName.Trim()
            };

            levelRepository.SaveLevel(level);

            return Created(level);
        }

        public IActionResult Put([FromRoute] int key, [FromBody] LevelReq postLevel)
        {
            var level = levelRepository.GetLevelById(key);

            if (level == null)
            {
                return NotFound();
            }

            if (!postLevel.LevelName.Trim().Equals(level.LevelName))
            {
                var tempLevel = levelRepository.GetLevelByName(postLevel.LevelName.Trim());

                if (tempLevel != null)
                {
                    return BadRequest("Level already exists.");
                }

                level.LevelName = postLevel.LevelName.Trim();
            }

            levelRepository.UpdateLevel(level);

            return Updated(level);
        }

        public ActionResult Delete([FromRoute] int key)
        {
            var level = levelRepository.GetLevelById(key);

            if (level == null)
            {
                return NotFound();
            }

            if (level.Contracts.Count > 0)
            {
                return BadRequest("Cannot delete level that already have contract");
            }

            levelRepository.DeleteLevel(level);
            return NoContent();
        }
    }
}
