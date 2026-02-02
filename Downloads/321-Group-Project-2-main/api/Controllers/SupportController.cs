using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportController : ControllerBase
    {
        private readonly AQEDbContext _context;
        private readonly ILogger<SupportController> _logger;

        public SupportController(AQEDbContext context, ILogger<SupportController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST api/support/donate
        [HttpPost("donate")]
        public async Task<IActionResult> ProcessDonation([FromBody] DonationRequest request)
        {
            try
            {
                if (request.Amount <= 0)
                {
                    return BadRequest(new { message = "Invalid donation amount" });
                }

                var donation = new Donation
                {
                    UserId = null, // Can be linked if user is logged in
                    DonorName = request.Name,
                    Email = request.Email,
                    Amount = request.Amount,
                    PaymentMethod = "stripe", // Would be determined by frontend
                    IsAnonymous = request.IsAnonymous,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Donations.Add(donation);
                await _context.SaveChangesAsync();

                // In production: Create Stripe Payment Intent and return client secret
                // For now, return success
                return Ok(new
                {
                    message = "Donation processed successfully",
                    donationId = donation.Id,
                    amount = donation.Amount,
                    message2 = "In production, this would redirect to Stripe checkout"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing donation");
                return StatusCode(500, new { message = "Error processing donation", error = ex.Message });
            }
        }

        // POST api/support/subscribe
        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
        {
            try
            {
                var userId = int.Parse(User?.Identity?.Name ?? "0");
                if (userId == 0)
                {
                    return Unauthorized(new { message = "You must be logged in to subscribe" });
                }

                // Check if user already has an active subscription
                var existingSub = await _context.Subscriptions
                    .FirstOrDefaultAsync(s => s.UserId == userId && s.IsActive);

                if (existingSub != null)
                {
                    return BadRequest(new { message = "You already have an active subscription" });
                }

                var subscription = new Subscription
                {
                    UserId = userId,
                    PlanType = request.PlanType,
                    PlanName = request.PlanName,
                    MonthlyPrice = request.MonthlyPrice,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(1), // Will be renewed
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Subscriptions.Add(subscription);
                await _context.SaveChangesAsync();

                // In production: Create Stripe Subscription and return checkout session
                return Ok(new
                {
                    message = "Subscription created successfully",
                    subscriptionId = subscription.Id,
                    planType = subscription.PlanType,
                    price = subscription.MonthlyPrice,
                    message2 = "In production, this would redirect to Stripe checkout"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating subscription");
                return StatusCode(500, new { message = "Error creating subscription", error = ex.Message });
            }
        }

        // GET api/support/premium/{userId}
        [HttpGet("premium/{userId}")]
        public async Task<IActionResult> CheckPremiumStatus(int userId)
        {
            try
            {
                var hasActiveSubscription = await _context.Subscriptions
                    .AnyAsync(s => s.UserId == userId && s.IsActive && s.EndDate > DateTime.UtcNow);

                return Ok(new { hasPremium = hasActiveSubscription });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking premium status");
                return StatusCode(500, new { message = "Error checking premium status", error = ex.Message });
            }
        }

        // GET api/support/subscription
        [HttpGet("subscription")]
        public async Task<IActionResult> GetSubscription()
        {
            try
            {
                var userId = int.Parse(User?.Identity?.Name ?? "0");
                if (userId == 0)
                {
                    return Unauthorized();
                }

                var subscription = await _context.Subscriptions
                    .Where(s => s.UserId == userId)
                    .OrderByDescending(s => s.CreatedAt)
                    .FirstOrDefaultAsync();

                if (subscription == null)
                {
                    return Ok(new { hasPremium = false, subscription = (object?)null });
                }

                return Ok(new
                {
                    hasPremium = subscription.IsActive && subscription.EndDate > DateTime.UtcNow,
                    subscription = new
                    {
                        planType = subscription.PlanType,
                        planName = subscription.PlanName,
                        monthlyPrice = subscription.MonthlyPrice,
                        startDate = subscription.StartDate,
                        endDate = subscription.EndDate,
                        isActive = subscription.IsActive
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting subscription");
                return StatusCode(500, new { message = "Error getting subscription", error = ex.Message });
            }
        }
    }

    public class DonationRequest
    {
        public decimal Amount { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public bool IsAnonymous { get; set; } = false;
    }

    public class SubscribeRequest
    {
        public string PlanType { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
    }
}

