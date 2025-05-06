using System.Reflection.Metadata;

namespace TCM_App.Models
{
    public class Member
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public  byte[] ProfilePicture { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public List<MemberBelt> Belts { get; set; }
        public required string Email { get; set; }
        public required bool IsActive { get; set; }
        public required DateTime StartedOn { get; set; }
        public bool IsCoach { get; set; }
    }
}
