using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BusinessObject
{
    public class Position
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string PositionName { get; set; }

        [JsonIgnore]
        public virtual ICollection<Contract> Contracts { get; set; }
    }
}
