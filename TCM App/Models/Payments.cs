namespace TCM_App.Models
{
    public class Payments
    {
        public int Id { get; set; }

        public Member Member { get; set; }
        public int MemberId { get; set; }

        public bool IsPaidOnline { get; set; }



        public DateTime PaymentDate { get; set; }
        public DateTime NextPaymentDate { get; set; }

    }
}
