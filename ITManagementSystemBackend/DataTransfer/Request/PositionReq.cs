using System.ComponentModel.DataAnnotations;

namespace DataTransfer.Request
{
    public class PositionReq
    {
        [Required]
        public string PositionName { get; set; }
    }
}
