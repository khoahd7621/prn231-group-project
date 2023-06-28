
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
        [EnableQuery]
        public IActionResult Get() => Ok(_contractRepository.GetContracts());
        public IActionResult Post([FromBody] ContractReq req)
        {
            var check = _contractRepository.createContract(req);
            return check.Equals("ok") ? Ok() : BadRequest(check);
        }
        public IActionResult Patch(int key, EnumList.ContractStatus status)
        {
            var check = _contractRepository.updateStatusContract(key, (int)status);
            return check == 1 ? Ok() : BadRequest(check);
        }
    }
}
