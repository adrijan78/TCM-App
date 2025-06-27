namespace TCM_App.Models.DTOs
{
    public class TrainingDetailsDto
    {
        public int Id { get; set; }
        public required DateTime Date { get; set; }
        public required string Description { get; set; }

        //This will be the coach
        public int MemberId { get; set; }

        public string? Status { get; set; }

        public int ClubId { get; set; }

        public string? TrainingType { get; set; }

        public List<MemberTrainingDto>? MemberTrainings { get; set; } 
    }
}
