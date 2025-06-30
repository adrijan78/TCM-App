namespace TCM_App.Models.DTOs
{
    public class MemberTokenDto
    {
        public required string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public required string Token { get; set; }
        public List<string>? Roles { get; set; }
    }
}
