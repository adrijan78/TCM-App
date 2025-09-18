using Microsoft.Extensions.Options;
using System.Net.Mail;
using TCM_App.EmailService.Services.Interfaces;

namespace TCM_App.EmailService.Services
{
    public class EmailServiceImpl : IEmailService
    {

        private readonly GmailSettings _gmailSettings;

        public EmailServiceImpl(IOptions<GmailSettings> gmailSettings)
        {
            
            _gmailSettings = gmailSettings.Value;

        }

        public async Task SendEmailAsync(SendEmailRequest sendEmailRequest)
        {

            MailMessage mailMessage = new MailMessage();

            mailMessage.From = new MailAddress(_gmailSettings.Email);
            mailMessage.To.Add(sendEmailRequest.Recipient);
            mailMessage.Subject = sendEmailRequest.Subject;
            mailMessage.Body = sendEmailRequest.MessageBody;
            mailMessage.IsBodyHtml = true;

            using (SmtpClient smtpClient = new SmtpClient(_gmailSettings.Host, _gmailSettings.Port))
            {
                smtpClient.Credentials = new System.Net.NetworkCredential(_gmailSettings.Email, _gmailSettings.Password);
                smtpClient.EnableSsl = true;
                
                await smtpClient.SendMailAsync(mailMessage);
            }




        }
    }
}
