using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BusinessObject
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required] 
        public string CustomerName { get; set; }
        [Required]
        public bool Gender{ get; set; }
        [Required]
        public DateTime Dob { get; set; }
        [Required, MinLength(10), MaxLength(12)]
        public string CCCD { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string EmployeeType { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Status { get; set; }

        [JsonIgnore]
        public virtual ICollection<Attendance> Attendances { get; set; }
        [JsonIgnore]
        public virtual ICollection<Contract> Contracts { get; set; }
        [JsonIgnore]
        public virtual ICollection<Current> Currents { get; set; }
        [JsonIgnore]
        public virtual ICollection<BaseSalary> BaseSalarys { get; set;}
        [JsonIgnore]
        public virtual ICollection<TakeLeave> TakeLeaves { get; set;}
        [JsonIgnore]
        public virtual ICollection<PayRollTmp> PayRollTmps { get; set;}
        [JsonIgnore]
        public virtual ICollection<PayRoll> PayRolls { get; set;}
    }
}
