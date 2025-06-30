namespace TCM_App.Models.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public PhotoDto ProfilePicture { get; set; }
        public int Age { get; set; }
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
        public int Age { get; set; }
        public List<MemberRoleDto> Roles { get; set; } = new List<MemberRoleDto>();

    }
}
