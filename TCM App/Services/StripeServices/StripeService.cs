using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using TCM_App.Models.Stripe;

namespace TCM_App.Services.StripeServices
{
    public class StripeService(IOptions<StripeModel> _model,
        CustomerService _customerService,
        ProductService productService) : IStripeService
    {
        public async Task<Customer> CreateCustomer(StripeCustomer customerInfo)
        {
            StripeConfiguration.ApiKey = _model.Value.SecretKey;
            var options = new CustomerCreateOptions
            {
                Email = customerInfo.Email,
                Name = customerInfo.Name,

            };
            var customer = await _customerService.CreateAsync(options);
            return customer;
        }
        public async Task<string> Pay(string priceId)
        {
            StripeConfiguration.ApiKey = _model.Value.SecretKey;

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/successfull-payment",
                CancelUrl = "http://localhost:4200/failed-payment",
                LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            Price = priceId,
                            Quantity = 1,
                        },
                    },
            };
            var service = new SessionService();
            Session session = await service.CreateAsync(options);
            return session.Url;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            StripeConfiguration.ApiKey = _model.Value.SecretKey;
            var productService = new ProductService();
            var products = await productService.ListAsync(new ProductListOptions
            {
                Limit = 1,
                Expand = new List<string> { "data.default_price" }
            });
            return products.Data;
        }




    }
}
