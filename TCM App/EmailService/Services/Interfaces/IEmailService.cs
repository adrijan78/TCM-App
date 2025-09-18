namespace TCM_App.EmailService.Services.Interfaces
{
    public interface IEmailService
    { 

        Task SendEmailAsync(SendEmailRequest sendEmailRequest);

    }
}
