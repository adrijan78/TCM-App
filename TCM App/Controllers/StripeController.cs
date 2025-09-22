using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using System.Security.Claims;
using TCM_App.EmailService;
using TCM_App.EmailService.Services.Interfaces;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Models.Stripe;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.StripeServices;

namespace TCM_App.Controllers
{

    public class StripeController(ILogger<StripeController> logger,
        IStripeService _stripeService,
        IRepository<Payments> _paymentsRepository,
        IEmailService _emailService ) : BaseController
    {

        [HttpPost("pay")]

        public async Task<IActionResult> Pay([FromBody] PayDto pay)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                var IsPayedOnline = true;
                string? sessionUrl = string.Empty;
                var payment = new Payments();

                var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

                if(role !=null && role.Value == "Coach")
                {
                    IsPayedOnline = false;
                }

                int loggedInUserId = 0;

                if (!string.IsNullOrEmpty(userId) && int.TryParse(userId, out int parsedId))
                {
                    loggedInUserId = parsedId;
                }

                if (IsPayedOnline)
                {
                     sessionUrl = await _stripeService.Pay(pay.PriceId);
                }
                else
                {
                     sessionUrl = "http://localhost:4200/successfull-payment";
                }

                    var today = DateTime.UtcNow;

                var existingPayment = await _paymentsRepository.Query()
                    .OrderByDescending(x => x.PaymentDate)
                    .FirstOrDefaultAsync();

                if (existingPayment !=null)
                {
                 
                    payment.PaymentDate = existingPayment.NextPaymentDate;
                    payment.NextPaymentDate = existingPayment.NextPaymentDate.AddMonths(1);


                }
                else
                {
                payment.PaymentDate = today;
                payment.NextPaymentDate = new DateTime(today.Year, today.Month, 15).AddMonths(1);

                }

                payment.MemberId = pay.MemberId;
                payment.IsPaidOnline = IsPayedOnline;

                

                await _paymentsRepository.AddAsync(payment);

                await _paymentsRepository.SaveChangesAsync();

                var emailRequest = new SendEmailRequest
                {
                    Recipient = pay.Email,
                    Subject = "Платена членарина",
                    MessageBody = "Успешно плативте членарина. Ви благодариме."
                };
                _emailService.SendEmailAsync(emailRequest);



                return Ok(new ApiResponse<string>{
                    Success = true,
                    Message = "Успешна трансакција",
                    Data = sessionUrl
                });



            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in Stripe payment process");
                return Problem(
                        title: "Вашата трансакција не е успешна. Ве молиме обидете се повторно или контактирајте ја вашата банка.",
                        statusCode: StatusCodes.Status500InternalServerError
                    );
            }




        }
        [HttpPost("create-customer")]
        public async Task<IActionResult> CreateCustomer([FromBody] StripeCustomer customerInfo)
        {
            try
            {
                var customer = await _stripeService.CreateCustomer(customerInfo);
                return Ok(customer);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error creating customer from Stripe");
                return Problem(
                        title: "Не може да се креира корисник. Ве молиме обидете се повторно подоцна.",
                        statusCode: StatusCodes.Status500InternalServerError
                );
            }       
            

        }

        [HttpGet("get-all-products")] 
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
               var products = await _stripeService.GetAllProducts();
                var priceId = products.FirstOrDefault().DefaultPriceId;
                return Ok(new {priceId});
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting products from Stripe");
                return Problem(
                        title: "Не може да се добијат производите. Ве молиме обидете се повторно подоцна.",
                        statusCode: StatusCodes.Status500InternalServerError
                    );
            }
        }
    }
}
