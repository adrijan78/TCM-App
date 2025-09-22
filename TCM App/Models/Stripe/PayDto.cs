namespace TCM_App.Models.Stripe
{
    public class PayDto
    {
        public string PriceId { get; set; }
        public int MemberId { get; set; }
        public string Email { get; set; }
    }
}
