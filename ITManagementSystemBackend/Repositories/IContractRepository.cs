using BusinessObject;
using DataTransfer.Request;

namespace Repositories
{
    public interface IContractRepository
    {
        public string CreateContract(ContractReq req);
        public List<Contract> GetContracts();
        public bool ActiveContract(int contractId);
        public Contract GetContract(int contractId);
        public bool UpdateContract(int contractId, ContractReq req);
        public bool DeleteContract(Contract contract);
        public bool DeactivateContract(int contractId);
    }
}
