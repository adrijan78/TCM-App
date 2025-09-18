using System.ComponentModel.DataAnnotations;

namespace TCM_App.Models.DTOs
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Лозинката е задолжителна")]
        public string? Password { get; set; }
        
        [Compare("Password", ErrorMessage = "Лозинките не се совпаѓаат")]
        [Required(ErrorMessage = "Лозинката е задолжителна")]
        public string ConfirmPassword { get; set; }

        public string? Token { get; set; }
        public string Email { get; set; }
    }
}
