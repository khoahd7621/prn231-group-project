using BusinessObject;
using BusinessObject.Enum;
using Microsoft.EntityFrameworkCore;

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
            context.Entry(contract).State = EntityState.Modified;
            context.SaveChanges();
        }

        public static Contract FindContractById(int id)
        {
            var context = new MyDbContext();
            return context.Contracts
                .Include(s => s.User)
                .Include(s => s.Level)
                .Include(s => s.Position)
                .SingleOrDefault(x => x.Id == id);
        }

        public static bool CheckEmployeeHaveAnyContract(int empId)
        {
            var context = new MyDbContext();
            var check = context.Contracts.Where(x => x.EmployeeId == empId).FirstOrDefault();
            return check != null;
        }

        public static Contract checkEmployeeHasAnyActiveContract(int empId)
        {
            var context = new MyDbContext();
            return context.Contracts.Where(x => x.EmployeeId == empId && x.Status == EnumList.ContractStatus.Active).Include(x => x.User).FirstOrDefault();
        }

        public static List<Contract> GetAll()
        {
            var context = new MyDbContext();
            return context.Contracts
                .Include(s => s.User)
                .Include(s => s.Level)
                .Include(s => s.Position)
                .ToList();
        }

        public static void DeleteContract(Contract contract)
        {
            var context = new MyDbContext();
            context.Contracts.Remove(contract);
            context.SaveChanges();
        }
        public static List<Contract> CheckEmployeeHasAnyContractOfThisMonth(int empId,DateTime dateTime)
        {
            var context = new MyDbContext();
            return context.Contracts.Where(x => x.EmployeeId == empId
                                            && ((dateTime.Date.Month == x.StartDate.Date.Month && dateTime.Date.Year == x.StartDate.Date.Year)
                                            ||(dateTime.Date.Month == x.EndDate.Date.Month && dateTime.Date.Year == x.EndDate.Date.Year))
                                            && x.Status != EnumList.ContractStatus.Waiting)
                                            .ToList();
        }
        public static List<Contract> GetContractsByEmpId(int empId)
        {
            var context = new MyDbContext();
            return context.Contracts.Where(x => x.EmployeeId == empId).ToList();
        }
    }
}
