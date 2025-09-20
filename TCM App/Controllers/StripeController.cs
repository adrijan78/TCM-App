using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using TCM_App.Models.DTOs;
using TCM_App.Models.Stripe;
using TCM_App.Services.StripeServices;

namespace TCM_App.Controllers
{

    public class StripeController(ILogger<StripeController> logger,IStripeService _stripeService) : BaseController
    {

        [HttpPost("pay")]

        public async Task<IActionResult> Pay([FromBody] PayDto pay)
        {
            try
            {
                
                 var sessionUrl= await _stripeService.Pay(pay.PriceId);
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
