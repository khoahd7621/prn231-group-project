using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject
{
    public class TakeLeave
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string Type { get; set; }

        public string? Reason { get; set; }
        [Required]
        public int EmployeeId { get; set; }
        public virtual Employee User { get; set; }
    }
}
