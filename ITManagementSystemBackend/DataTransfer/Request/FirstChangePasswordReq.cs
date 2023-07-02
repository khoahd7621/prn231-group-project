using System.ComponentModel.DataAnnotations;

namespace DataTransfer.Request
{
    public class FirstChangePasswordReq
    {
        [Required]
        public string Password { get; set; }
    }
}
