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

    }

}
