namespace TCM_App.Models
{
    public class Belt
    {
        public int Id { get; set; }
        public string BeltName { get; set; }
        public List<MemberBelt> Members { get; set; } = []; // Initialize to an empty lists
    }
}
