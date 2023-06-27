using BusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class ContractDAO
    {
        public static void CreateContract(Contract contract)
        {
            var context = new MyDbContext();
            context.Contracts.Add(contract);
            context.SaveChanges();
        }
        public static void UpdateContract(Contract contract)
        {
            var context = new MyDbContext();
            context.Entry<Contract>(contract).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
        }
        public static Contract FindContractById(int id)
        {
            var context = new MyDbContext();
            return context.Contracts.SingleOrDefault(x => x.Id == id);
        }
    }
}
