using BusinessObject;

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
        public static bool CheckEmployeeHaveAnyContract(int empId)
        {
            var context = new MyDbContext();
            var check = context.Contracts.Where(x => x.EmployeeId == empId).FirstOrDefault();
            return check != null;
        }
        public static List<Contract> GetAll()
        {
            var context = new MyDbContext();
            return context.Contracts.ToList();
        }
    }
}
