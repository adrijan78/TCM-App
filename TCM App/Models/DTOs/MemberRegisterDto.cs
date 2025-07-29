using System.ComponentModel.DataAnnotations;

namespace TCM_App.Models.DTOs
{
    public class MemberRegisterDto
    {
        [MaxLength(50)]
        public required string FirstName { get; set; }

        [MaxLength(50)]
        public required string LastName { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required BeltDto Belt { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        public required string Password { get; set; }



        public  bool? IsActive { get; set; } = true;
        public  DateTime? StartedOn { get; set; }=DateTime.UtcNow;

        public bool? IsCoach { get; set; } 

        public float Height { get; set; }
        public float Weight { get; set; }

        public int[]? RolesIds { get; set; }
        

    }
}
