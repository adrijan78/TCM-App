using Microsoft.AspNetCore.Identity;
using System.Reflection.Metadata;
using TCM_App.Helpers;

namespace TCM_App.Models
{
    public class Member:IdentityUser<int>
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public int PhotoId { get; set; }
        public Photo ProfilePicture { get; set; } 
        public required DateTime DateOfBirth { get; set; }
        public List<MemberBelt> Belts { get; set; } = [];
        public byte[] PasswordSalt { get; set; } = [];
        public required bool IsActive { get; set; }
        public DateTime StartedOn { get; set; }
        public bool IsCoach { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }

        public int? ClubId { get; set; }
        public Club? Club { get; set; }

        public List<MemberTraining> MemberTrainings { get; set; } = [];

        public List<Note> NotesSent { get; set; } = [];

        public List<Note> NotesReceived { get; set; }= [];

        public List<AppMemberRole> MemberRoles { get; set; } = [];

        //public int GetAge()
        //{
        //    return CalculateAgeHelper.CalculateAge(DateOfBirth);
        //}
    }




}
