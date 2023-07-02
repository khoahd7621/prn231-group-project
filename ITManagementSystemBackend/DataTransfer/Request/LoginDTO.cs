using System.ComponentModel.DataAnnotations;

namespace DataTransfer.Request
{
    public class LoginDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
