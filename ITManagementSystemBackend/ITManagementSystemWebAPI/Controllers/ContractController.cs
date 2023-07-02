using BusinessObject.Enum;
using DataTransfer.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Repositories;
using Repositories.Impl;

namespace ITManagementSystemWebAPI.Controllers
{
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
        public IActionResult Delete([FromRoute] int key)
        {
            var checkContract = _contractRepository.GetContract(key);
            if(checkContract == null)
                return BadRequest("Not Found");
            var check = _contractRepository.DeleteContract(checkContract);
            return check ? Ok() : BadRequest("Contract with different status watting cannot be deleted");
        }
        public IActionResult Post([FromBody] ContractReq req)
        {
            var check = _contractRepository.CreateContract(req);
            return check.Equals("ok") ? Ok() : BadRequest(check);
        }
        public IActionResult Put([FromRoute] int key, [FromBody] ContractReq req)
        {
            var checkContract = _contractRepository.GetContract(key);
            if (checkContract == null)
                return BadRequest("Contract not exist");
            var check = _contractRepository.UpdateContract(key, req);
            return check ? Ok() : BadRequest("Contract has status is active can't edit");
        }

        [HttpPatch("odata/Contract/Deactive/{id}")]
        public IActionResult Deactive(int id)
        {
            var checkContract = _contractRepository.GetContract(id);
            if (checkContract == null)
                return BadRequest("This contract not exist");
            if(checkContract.Status != EnumList.ContractStatus.Active)
                return BadRequest("Contract only has status Active can be Deactive");
            _contractRepository.DeactiveContract(id);
            return Ok();
        }
        [HttpPatch("odata/Contract/Active/{id}")]
        public IActionResult Active(int id)
        {
            var checkContract = _contractRepository.GetContract(id);
            if (checkContract == null) 
                return BadRequest("This contract not exist");
            var checkEmployee = employeeRepository.GetEmployeeById(checkContract.EmployeeId);
            if (checkEmployee.Status == EnumList.EmployeeStatus.Deactive)
                return BadRequest("This user is deactive, need to active this user first");
            var checkSuccess = _contractRepository.ActiveContract(id);
            return checkSuccess ? Ok() : BadRequest("This user already has active contract, stop to active this contract");
        }

    }
}
