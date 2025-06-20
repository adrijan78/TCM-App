using TCM_App.Models.Enums;

namespace TCM_App.Models.DTOs
{
    public class TrainingDto
    {
        public int Id { get; set; }
        public required DateTime Date { get; set; }
        public required string Description { get; set; }

        //This will be the coach
        public int MemberId { get; set; }


        public int ClubId { get; set; }

        public string? TrainingType { get; set; }
    }
}
