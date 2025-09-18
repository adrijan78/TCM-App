using System.ComponentModel.DataAnnotations;

namespace TCM_App.Models.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public PhotoDto ProfilePicture { get; set; }
        public int Age { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<BeltDto>? Belts { get; set; }
        public string Email { get; set; }
        public required bool IsActive { get; set; }
        public DateTime StartedOn { get; set; }
        public bool IsCoach { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
        public BeltDto? CurrentBelt { get; set; }
        public List<MemberRoleDto> MemberRoles { get; set; }= new List<MemberRoleDto>();

    }

    public class MemberListDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public PhotoDto ProfilePicture { get; set; }
        public int Age { get; set; }

        public BeltDto Belt { get; set; }
        public string Email { get; set; }
        public required bool IsActive { get; set; }
        public DateTime StartedOn { get; set; }
        public bool IsCoach { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
        public List<MemberRoleDto> Roles { get; set; } = new List<MemberRoleDto>();

    }

    public class MemberSimpleDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public PhotoDto ProfilePicture { get; set; }

        //public int Age { get; set; }
        //public List<MemberRoleDto> Roles { get; set; } = new List<MemberRoleDto>();

    }

    public class MemberEditDto
    {
        [MaxLength(50)]
        public required string FirstName { get; set; }

        [MaxLength(50)]
        public required string LastName { get; set; }
        public required DateTime DateOfBirth { get; set; }

        public string Email { get; set; }

        public bool? IsActive { get; set; } = true;

        public bool? IsCoach { get; set; }

        public float Height { get; set; }
        public float Weight { get; set; }

        public int[]? RolesIds { get; set; }

        public IFormFile? NewPhoto { get; set; }

        public int CurrentBeltId { get; set; }

    }

    public class MemberForTrainingDto 
    {

        public int MemberId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public MemberBeltDto Belt { get; set; }

    }

    public class MemberDropdownDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        //public PhotoDto? ProfilePicture { get; set; }
    }



}
