using System.ComponentModel.DataAnnotations.Schema;

namespace TCM_App.Models
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string? Url { get; set; }
        public string? PublicId { get; set; }

        public int MemberId { get; set; }
        public required Member Member { get; set; }
    }
}