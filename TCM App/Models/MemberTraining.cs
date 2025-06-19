using System.ComponentModel.DataAnnotations.Schema;

namespace TCM_App.Models
{
    public class MemberTraining
    {
        public MemberTraining()
        {
            // Default constructor for EF Core
        }
        public MemberTraining( DateTime date, string description, int trainingId, int memberId, int performace)
        {

            Date = date;
            Description = description;
            TrainingId = trainingId;
            MemberId = memberId;
            Performace = performace;
        }

        public int Id { get; set; }
        public required DateTime Date { get; set; }
        public required string Description { get; set; }
        public int TrainingId { get; set; }
        public Training Training { get; set; } = null!; // Ensure Training is not null

        public int MemberId { get; set; }
        public Member Member { get; set; } = null!; // Ensure Member is not null
        public int Performace { get; set; }
    }
}
