using System.ComponentModel.DataAnnotations;

namespace TCM_App.Models.DTOs
{
    public class MemberRegisterDto
    {
        [MaxLength(50)]
        public required string FirstName { get; set; }

        [MaxLength(50)]
        public required string LastName { get; set; }
        public byte[] ProfilePicture { get; set; }
        public required DateTime DateOfBirth { get; set; }
        //public List<MemberBelt> Belts { get; set; }

        [EmailAddress]
        public required string Email { get; set; }

        public required string Password { get; set; }

        //public required bool IsActive { get; set; }
        //public required DateTime StartedOn { get; set; }

    }
}
