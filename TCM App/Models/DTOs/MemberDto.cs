namespace TCM_App.Models.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public  string FirstName { get; set; }
        public  string LastName { get; set; }
        public int PhotoId { get; set; }
        public PhotoDto ProfilePicture { get; set; }
        public  int Age { get; set; }
        public List<MemberBelt>? Belts { get; set; }
        public  string Email { get; set; }
        public required bool IsActive { get; set; }
        public DateTime StartedOn { get; set; }
        public bool IsCoach { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }

    }
}
