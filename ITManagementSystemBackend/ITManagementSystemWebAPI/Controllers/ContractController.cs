using BusinessObject.Enum;
using DataTransfer.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
    [Authorize]
    public class ContractController : ODataController
    {
        private IContractRepository _contractRepository = new ContractRepository();
        private IEmployeeRepository employeeRepository = new EmployeeRepository();

        [EnableQuery]
        public IActionResult Get() => Ok(_contractRepository.GetContracts());

        [EnableQuery]
        public IActionResult Get([FromRoute] int key)
        {
            var check = _contractRepository.GetContract(key);
            return check == null ? NotFound() : Ok(check);
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Delete([FromRoute] int key)
        {
            var checkContract = _contractRepository.GetContract(key);
            if (checkContract == null)
                return BadRequest("Not Found");
            var check = _contractRepository.DeleteContract(checkContract);
            return check ? Ok() : BadRequest("Contract with different status watting cannot be deleted");
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] ContractReq req)
        {
            var checkEmployeeTypeIsDefined = !Enum.IsDefined(typeof(EnumList.EmployeeType), req.EmployeeType);
            var checkSalaryTypeIsDefined = !Enum.IsDefined(typeof(EnumList.SalaryType), req.SalaryType);
            if (checkEmployeeTypeIsDefined || checkSalaryTypeIsDefined) return BadRequest("Employee Type or Salary Type is not defined");
            var check = _contractRepository.CreateContract(req);
            return check.Equals("ok") ? Ok() : BadRequest(check);
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute] int key, [FromBody] ContractReq req)
        {
            var checkContract = _contractRepository.GetContract(key);
            if (checkContract == null)
                return BadRequest("Contract not exist");
            var check = _contractRepository.UpdateContract(key, req);
            return check ? Ok() : BadRequest("Contract has status is active can't edit");
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("odata/Contract/Deactivate/{key}")]
        public IActionResult Deactivate([FromRoute] int key)
        {
            var checkContract = _contractRepository.GetContract(key);
            if (checkContract == null)
                return NotFound("This contract not exist");
            if (checkContract.Status != EnumList.ContractStatus.Active)
                return BadRequest("Contract only has status Active can be Deactivate");
            _contractRepository.DeactivateContract(key);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("odata/Contract/Activate/{key}")]
        public IActionResult Activate([FromRoute] int key)
        {
            var checkContract = _contractRepository.GetContract(key);
            if (checkContract == null)
                return NotFound("This contract not exist");
            if (checkContract.Status != EnumList.ContractStatus.Waiting)
                return BadRequest("Contract only has status Waiting can be Active");
            var checkEmployee = employeeRepository.GetEmployeeById(checkContract.EmployeeId);
            if (checkEmployee.Status == EnumList.EmployeeStatus.Deactive)
                return BadRequest("This user is deactive, need to active this user first");
            var checkSuccess = _contractRepository.ActiveContract(key);
            return checkSuccess ? Ok() : BadRequest("This user already has active contract, stop the previous first then perform this action");
        }
    }
}
