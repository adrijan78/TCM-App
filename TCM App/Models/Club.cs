namespace TCM_App.Models
{
    public class Club
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }

        public List<Member>? Members { get; set; }
        public List<Training>? Trainings { get; set; }

        public Photo? ClubLogo { get; set; }

    }
}
