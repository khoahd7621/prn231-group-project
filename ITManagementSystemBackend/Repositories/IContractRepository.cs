using BusinessObject;
using DataTransfer.Request;

namespace Repositories
{
    public interface IContractRepository
    {
        public string CreateContract(ContractReq req);
        public int UpdateStatusContract(int contractId, int status);
        public List<Contract> GetContracts();
        public bool ActiveContract(int contractId);
        public Contract GetContract(int contractId);
        public bool UpdateContract(int contractId,ContractReq req);
        public bool DeleteContract(Contract contract);
    }
}
