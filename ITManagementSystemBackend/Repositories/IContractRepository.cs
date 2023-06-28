using BusinessObject;
using DataTransfer.Request;

namespace Repositories
{
    public interface IContractRepository
    {
        public string createContract(ContractReq req);
        public int updateStatusContract(int contractId, int status);

        public List<Contract> GetContracts();
    }
}
