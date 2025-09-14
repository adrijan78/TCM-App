namespace TCM_App.Models.DTOs
{
    public class BeltDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime EarnedOn { get; set; }
    }

    public class MemberBeltDto : BeltDto
    {
        public bool IsCurrentBelt { get; set; }
        public string Description { get; set; } = "";


    }

    public class UpdateMemberBeltDto: MemberBeltDto
    {
        public int MemberId { get; set; }
        public int BeltId { get; set; }

    }

}
