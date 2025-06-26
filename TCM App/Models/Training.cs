using TCM_App.Models.Enums;

namespace TCM_App.Models
{
    public class Training
    {
        public int Id { get; set; }
        public required DateTime Date { get; set; }
        public required string Description { get; set; }

        //This will be the coach
        public int MemberId { get; set; }
        public Member Member { get; set; } = null!; // Ensure Member is not null

        public int Status { get; set; }


        public int ClubId { get; set; }
        public Club Club { get; set; } = null!; // Ensure Club is not null
        public List<MemberTraining> MemberTrainings { get; set; } = []; // Initialize to an empty list

        public TrainingType TrainingType { get; set; } 
    }
}
