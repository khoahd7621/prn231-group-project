using BusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Impl
{
    public class TakeLeaveRepository : EfEntityRepositoryBase<TakeLeave, MyDbContext>, ITakeLeaveRepository
    {
        public void DeleteTakeLeave(TakeLeave takeLeave) => Remove(takeLeave);


        public IEnumerable<TakeLeave> GetAllTakeLeavesByDateBetween(DateTime startDate, DateTime endDate) => (IEnumerable<TakeLeave>)GetAll(filter: tl => tl.Date >= startDate && tl.Date <= endDate);


        public IEnumerable<TakeLeave> GetAllTakeLeavesByEmployeeIdEqual(int id) => (IEnumerable<TakeLeave>)GetAll(filter: tl => tl.EmployeeId == id);


        public TakeLeave GetTakeLeaveByDateEqualAndEmployeeIdEqual(DateTime date, int employeeId) => GetFirstOrDefault(filter: tl => tl.Date.Equals(date) && tl.EmployeeId == employeeId && tl.Status.Equals(TakeLeaveStatus.APPROVED), includeProperties: "User");

        public TakeLeave GetTakeLeaveById(int id) => GetFirstOrDefault(filter: tl => tl.Id == id, includeProperties: "User");


        public IEnumerable<TakeLeave> GetTakeLeaves() => (IEnumerable<TakeLeave>)GetAll(includeProperties: "User");

        public void SaveTakeLeave(TakeLeave takeLeave) => Add(takeLeave);

        public void UpdateTakeLeave(TakeLeave takeLeave) => Update(takeLeave);
    }
}
