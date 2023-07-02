using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject
{
    public enum TakeLeaveStatus
    {
        DELETED = 0,
        WAITING = 1,
        APPROVED = 2,
        REJECTED = 4,
    }
    public enum TakeLeaveCategory
    {
        ONE_DAY_LEAVE = 0,
        SERVERAL_DAYS_LEAVE = 1,
    }
    public enum TakeLeaveType
    {
        ANNUAL_LEAVE = 0,
        MATERNITY_LEAVE = 2,
        PATERNITY_LEAVE = 3,
        BEREAVEMENT_LEAVE = 4,
        PUBLIC_HOLIDAY = 5,
        UNPAID_LEAVE = 9,
    }

    public class TakeLeave
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Required]
        public TakeLeaveStatus Status { get; set; }
        [Required]
        public TakeLeaveType Type { get; set; }
        [Required]
        public TakeLeaveCategory Category { get; set; }

        public string? Reason { get; set; }
        [Required]
        public int LeaveDays { get; set; }
        [Required]
        public int EmployeeId { get; set; }
        [ForeignKey("EmployeeId")]
        public virtual Employee User { get; set; }
    }
}
