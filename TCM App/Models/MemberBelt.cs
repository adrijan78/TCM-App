namespace TCM_App.Models
{
    public class MemberBelt
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public Member Member { get; set; }

        public int BeltId { get; set; }
        public Belt Belt { get; set; }

        public DateTime DateReceived { get; set; }

        public string Description { get; set; }
        public bool IsCurrentBelt { get; set; }
    }
}
