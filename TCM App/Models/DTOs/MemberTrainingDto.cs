using TCM_App.Models.Enums;

namespace TCM_App.Models.DTOs
{
    public class MemberTrainingDto
    {
        public int Id { get; set; }
        public required DateTime Date { get; set; }
        public required string Description { get; set; }

        //This will be the coach
        public int MemberId { get; set; }   

        public int ClubId { get; set; }
        public int Performace { get; set; }
        public TrainingDto? Training { get; set; }
        public MemberSimpleDto? Member { get; set; }
        public MemberTrainingStatusEnum Status { get; set; }
    }

    public class  CreateMemberTrainingDto
    {
        public required DateTime Date { get; set; }
        public required string Description { get; set; }
        //This will be the coach
        public int MemberId { get; set;}   
        public int ClubId { get; set; }
        public int? Performace { get; set; }
        public MemberTrainingStatusEnum Status { get; set; }

    }

    public class UpdateMemberTrainingDto
    {
        //public required DateTime Date { get; set; }
        public  int Id { get; set; }

        public int MemberId { get; set; }
        public required string Description { get; set; }
        public int? Performance { get; set; }
        public MemberTrainingStatusEnum Status { get; set; }
    }

    public class MemberTrainingSimpleDto
    {
        public int Id { get; set; }

    }
}
