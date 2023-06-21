using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BusinessObject
{
    public class Level
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string LevelName { get; set; }

        [JsonIgnore]
        public virtual ICollection<Contract> Contracts { get; set; }
    }
}
