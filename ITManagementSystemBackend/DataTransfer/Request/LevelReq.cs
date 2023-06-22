using System.ComponentModel.DataAnnotations;

namespace DataTransfer.Request
{
    public class LevelReq
    {
        [Required]
        public string LevelName { get; set; }
    }
}
