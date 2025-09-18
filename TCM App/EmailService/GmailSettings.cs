namespace TCM_App.EmailService
{
    public class GmailSettings
    {
        public const string GmailSettingsKey = "GmailSettings";
        public string Host { get; set; }
        public int Port { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
