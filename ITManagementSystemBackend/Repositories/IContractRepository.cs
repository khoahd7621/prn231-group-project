using BusinessObject;
using DataTransfer.Request;

namespace Repositories
{
    public interface IContractRepository
    {
        public string createContract(ContractReq req);
        public int updateStatusContract(int contractId, int status);

        public List<Contract> GetContracts();
        public bool ActiveContract(int contractId);
        public Contract GetContract(int contractId);
    }
}
