using BusinessObject;

namespace Repositories
{
    public interface ITakeLeaveRepository
    {
        void SaveTakeLeave(TakeLeave takeLeave);
        TakeLeave GetTakeLeaveById(int id);
        IEnumerable<TakeLeave> GetAllTakeLeavesByEmployeeIdEqual(int id);
        IEnumerable<TakeLeave> GetAllTakeLeavesByDateBetween(DateTime startDate, DateTime endDate);
        TakeLeave GetTakeLeaveByDateBetweenAndEmployeeIdEqual(DateTime startDate, DateTime endDate, int employeeId);
        IEnumerable<TakeLeave> GetTakeLeaves();
        void UpdateTakeLeave(TakeLeave takeLeave);
        void DeleteTakeLeave(TakeLeave takeLeave);
        Contract GetActiveContractByEmployeeIdEqual(int employeeId);
        int CalculateLeaveDays(DateTime startDate, DateTime endDate);
        int CalculateLeaveDaysByEmployeeIdEqualAndYearEqual(int employeeId, int year);
        public int CalculateLeaveDaysByEmployeeIdEqualAndMonthEqualAndYearEqual(int employeeId, DateTime startDate, DateTime endDate);
        bool existApprovedAttendanceByDateEqualAndEmployeeEqual(int employeeId, DateTime startDate, DateTime endDate);

    }
}
