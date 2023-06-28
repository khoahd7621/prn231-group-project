using BusinessObject;
using DataTransfer.Request;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public interface IContractRepository
    {
        public string createContract(ContractReq req);
        public int updateStatusContract(int contractId,int status);

        public List<Contract> GetContracts();
    }
}
