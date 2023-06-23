using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject
{
    public enum TakeLeaveStatus
    {
        DELETED = 0,
        WAITING = 1,
        APPROVED = 2,
        REJECTED = 4
    }
    public class TakeLeave
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public TakeLeaveStatus Status { get; set; }
        [Required]
        public string Type { get; set; }

        public string? Reason { get; set; }
        [Required]
        public int EmployeeId { get; set; }
        [ForeignKey("EmployeeId")]
        public virtual Employee User { get; set; }
    }
}
