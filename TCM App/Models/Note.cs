using TCM_App.Models.Enums;

namespace TCM_App.Models
{
    public class Note
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }
        public int FromMemberId { get; set; }
        public required Member FromMember { get; set; }

        public int ToMemberId { get; set; }
        public required Member ToMember { get; set; }
        
        public int? TrainingId { get; set; }

        public required Training? Training { get; set; }

        public required NotePriorityEnum Priority { get; set; }


    }
}
