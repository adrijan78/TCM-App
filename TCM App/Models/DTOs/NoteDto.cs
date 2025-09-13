using TCM_App.Models.Enums;

namespace TCM_App.Models.DTOs
{
    public class NoteDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }

        public bool CreatedForTraining { get; set; }

        public NotePriorityEnum Priority { get; set; }
    }

    public class AddNoteDto
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }

        public bool CreatedForTraining { get; set; }

        public int FromMemberId { get; set; }
        public int ToMemberId { get; set; }
        public int? TrainingId { get; set; }
        public NotePriorityEnum Priority { get; set; }
    }

}
