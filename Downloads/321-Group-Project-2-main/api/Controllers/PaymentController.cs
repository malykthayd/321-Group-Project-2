using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly AQEDbContext _context;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(AQEDbContext context, ILogger<PaymentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST api/payment/process
        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
        {
            try
            {
                // In production, this would integrate with real Stripe API
                // For now, we simulate successful payment processing

                _logger.LogInformation("[Payment] Processing {Type} payment: ${Amount}", request.Type, request.Amount);

                // Simulate payment processing delay
                await Task.Delay(1000);

                // Record the payment
                var payment = new Donation // Reusing Donation model for simplicity
                {
                    Amount = request.Amount,
                    DonorName = request.CardholderName,
                    Email = null,
                    PaymentMethod = "stripe_simulated",
                    TransactionId = $"txn_{Guid.NewGuid():N}",
                    IsAnonymous = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Donations.Add(payment);
                await _context.SaveChangesAsync();

                // Handle different payment types
                string message = request.Type switch
                {
                    "donation" => "Thank you for your donation!",
                    "subscription" => "Your subscription has been activated!",
                    "licensing" => "Your institutional license is being processed!",
                    "certification" => "Your enrollment has been confirmed!",
                    _ => "Payment processed successfully!"
                };

                return Ok(new
                {
                    success = true,
                    message = message,
                    transactionId = payment.TransactionId,
                    amount = payment.Amount,
                    cardLast4 = request.CardNumber
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Payment] Error processing payment");
                return StatusCode(500, new { message = "Payment processing failed", error = ex.Message });
            }
        }
    }

    public class PaymentRequest
    {
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string CardholderName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string ExpirationDate { get; set; } = string.Empty;
        public object? Data { get; set; }
    }
}

