using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using TCM_App.Models.Stripe;

namespace TCM_App.Services.StripeServices
{
    public interface IStripeService
    {
        public Task<string> Pay(string priceId);
        public Task<Customer> CreateCustomer(StripeCustomer customerInfo);
        public Task<List<Product>> GetAllProducts();
    }
}
