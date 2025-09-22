namespace TCM_App.Models.DTOs
{
    public class PaymentsDto
    {
        public int Id { get; set; }        
        public int MemberId { get; set; }

        public string MemberName { get; set; }


        public bool IsPaidOnline { get; set; }

        public DateTime PaymentDate { get; set; }
        public DateTime NextPaymentDate { get; set; }
    }
}
