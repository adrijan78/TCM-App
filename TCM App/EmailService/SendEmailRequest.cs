namespace TCM_App.EmailService
{
    public class SendEmailRequest
    {
        public string Recipient { get; set; }
        public string Subject { get; set; }
        public string MessageBody { get; set; }
    }
}
