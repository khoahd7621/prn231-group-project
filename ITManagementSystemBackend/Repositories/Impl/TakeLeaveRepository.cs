using BusinessObject;
using BusinessObject.Enum;

namespace Repositories.Impl
{
    public class TakeLeaveRepository : EfEntityRepositoryBase<TakeLeave, MyDbContext>, ITakeLeaveRepository
    {
        private readonly EfEntityRepositoryBase<Contract, MyDbContext> _contractRepository = new EfEntityRepositoryBase<Contract, MyDbContext>();
        private static readonly List<DateTime> publicHolidays = new List<DateTime>
        {
            new DateTime(2023, 1, 1),    // New Year's Day
            new DateTime(2023, 2, 10),   // Lunar New Year's Eve
            new DateTime(2023, 2, 11),   // Lunar New Year (Day 1)
            new DateTime(2023, 2, 12),   // Lunar New Year (Day 2)
            new DateTime(2023, 2, 13),   // Lunar New Year (Day 3)
            new DateTime(2023, 2, 14),   // Lunar New Year (Day 4)
            new DateTime(2023, 4, 25),   // Reunification Day
            new DateTime(2023, 5, 1),    // Labor Day
            new DateTime(2023, 9, 2),    // National Day
        };

        public int CalculateLeaveDays(DateTime startDate, DateTime endDate)
        {
            int leaveDays = 0;
            DateTime currentDate = startDate;

            while (currentDate <= endDate)
            {
                if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                    currentDate.DayOfWeek != DayOfWeek.Sunday &&
                    !IsPublicHoliday(currentDate, publicHolidays))
                {
                    leaveDays++;
                }
                currentDate = currentDate.AddDays(1);
            }

            return leaveDays;
        }
        private bool IsPublicHoliday(DateTime date, List<DateTime> publicHolidays)
        {
            foreach (DateTime holiday in publicHolidays)
            {
                if (date.Date == holiday.Date)
                {
                    return true;
                }
            }
            return false;
        }

        public void DeleteTakeLeave(TakeLeave takeLeave) => Remove(takeLeave);

        public Contract GetActiveContractByEmployeeIdEqual(int employeeId) => _contractRepository.GetFirstOrDefault(filter: c => c.EmployeeId == employeeId && c.Status.Equals(EnumList.ContractStatus.Active));

        public IEnumerable<TakeLeave> GetAllTakeLeavesByDateBetween(DateTime startDate, DateTime endDate) => (IEnumerable<TakeLeave>)GetAll(filter: tl => (tl.StartDate.Date <= endDate.Date && startDate.Date <= tl.EndDate.Date), options: tl => tl.OrderByDescending(o => o.Id).ToList());
        public IEnumerable<TakeLeave> GetAllTakeLeavesByEmployeeIdEqual(int id) => (IEnumerable<TakeLeave>)GetAll(filter: tl => tl.EmployeeId == id && !tl.Status.Equals(TakeLeaveStatus.DELETED), options: tl=> tl.OrderByDescending(o=>o.Id).ToList());

        public TakeLeave GetTakeLeaveByDateBetweenAndEmployeeIdEqual(DateTime startDate, DateTime endDate, int employeeId) => GetFirstOrDefault(filter: tl => (tl.StartDate.Date <= endDate.Date && startDate.Date <= tl.EndDate.Date) && tl.EmployeeId == employeeId && (tl.Status.Equals(TakeLeaveStatus.APPROVED)), includeProperties: "User");

        public TakeLeave GetTakeLeaveById(int id) => GetFirstOrDefault(filter: tl => tl.Id == id, includeProperties: "User");


        public IEnumerable<TakeLeave> GetTakeLeaves() => (IEnumerable<TakeLeave>)GetAll(includeProperties: "User", options: tl => tl.OrderByDescending(o => o.Id).ToList());

        public void SaveTakeLeave(TakeLeave takeLeave) => Add(takeLeave);

        public void UpdateTakeLeave(TakeLeave takeLeave) => Update(takeLeave);

        public int CalculateLeaveDaysByEmployeeIdEqualAndYearEqual(int employeeId, int year) => GetAll(filter: tl => (tl.StartDate.Year.Equals(year)) && tl.EmployeeId == employeeId && tl.Type.Equals(TakeLeaveType.ANNUAL_LEAVE) && tl.Status.Equals(TakeLeaveStatus.APPROVED)).Sum(tl => tl.LeaveDays);
    }
}
