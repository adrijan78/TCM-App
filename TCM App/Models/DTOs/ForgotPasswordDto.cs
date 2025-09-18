using System.ComponentModel.DataAnnotations;

namespace TCM_App.Models.DTOs
{
    public class ForgotPasswordDto
    {
        [EmailAddress]
        public  string?  Email { get; set; }

        public  string? ClientUri { get; set; }
    }
}
