namespace TCM_App.Models.DTOs
{
    public class NoteDto
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }

        public bool CreatedForTraining { get; set; }
    }
}
