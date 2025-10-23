using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.SMS;
using api.Services;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("api/admin/accessibility")]
    public class AdminAccessibilityController : ControllerBase
    {
        private readonly AQEDbContext _context;
        private readonly IGatewayProvider _gatewayProvider;
        private readonly ILogger<AdminAccessibilityController> _logger;
        private readonly IConfiguration _configuration;

        public AdminAccessibilityController(
            AQEDbContext context,
            IGatewayProvider gatewayProvider,
            ILogger<AdminAccessibilityController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _gatewayProvider = gatewayProvider;
            _logger = logger;
            _configuration = configuration;
        }

        // GET api/admin/accessibility/overview
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            try
            {
                var today = DateTime.UtcNow.Date;

                var stats = new
                {
                    provider = _gatewayProvider.GetProviderName(),
                    gatewayNumber = _configuration["Gateway:SmsNumber"] ?? "+15551234567",
                    ussdCode = _configuration["Gateway:UssdCode"] ?? "*123#",
                    todayStats = new
                    {
                        inbound = await _context.GatewayMessages
                            .Where(m => m.Direction == "in" && m.CreatedAt >= today)
                            .CountAsync(),
                        outbound = await _context.GatewayMessages
                            .Where(m => m.Direction == "out" && m.CreatedAt >= today)
                            .CountAsync(),
                        delivered = await _context.GatewayMessages
                            .Where(m => m.Direction == "out" && m.Status == "delivered" && m.CreatedAt >= today)
                            .CountAsync(),
                        failed = await _context.GatewayMessages
                            .Where(m => m.Status == "failed" && m.CreatedAt >= today)
                            .CountAsync()
                    },
                    activeSessions = await _context.FlowSessions
                        .Where(s => s.ExpiresAt > DateTime.UtcNow)
                        .CountAsync(),
                    activeFlows = await _context.Flows
                        .Where(f => f.Active)
                        .CountAsync(),
                    topKeywords = await _context.SmsKeywords
                        .Where(k => k.Active)
                        .Take(5)
                        .Select(k => k.Keyword)
                        .ToListAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get overview");
                return StatusCode(500, new { message = "Error fetching overview", error = ex.Message });
            }
        }

        // GET api/admin/accessibility/messages
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            [FromQuery] string? direction = null,
            [FromQuery] string? status = null,
            [FromQuery] string? phone = null)
        {
            try
            {
                var query = _context.GatewayMessages.AsQueryable();

                if (!string.IsNullOrEmpty(direction))
                    query = query.Where(m => m.Direction == direction);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(m => m.Status == status);

                if (!string.IsNullOrEmpty(phone))
                    query = query.Where(m => m.PhoneE164.Contains(phone));

                var total = await query.CountAsync();
                var messages = await query
                    .OrderByDescending(m => m.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new { total, page, pageSize, data = messages });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get messages");
                return StatusCode(500, new { message = "Error fetching messages", error = ex.Message });
            }
        }

        // GET api/admin/accessibility/keywords
        [HttpGet("keywords")]
        public async Task<IActionResult> GetKeywords()
        {
            try
            {
                var keywords = await _context.SmsKeywords
                    .Include(k => k.Flow)
                    .OrderBy(k => k.Keyword)
                    .ToListAsync();

                return Ok(keywords);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get keywords");
                return StatusCode(500, new { message = "Error fetching keywords", error = ex.Message });
            }
        }

        // POST api/admin/accessibility/keywords
        [HttpPost("keywords")]
        public async Task<IActionResult> CreateKeyword([FromBody] SmsKeyword keyword)
        {
            try
            {
                _context.SmsKeywords.Add(keyword);
                await _context.SaveChangesAsync();
                return Ok(keyword);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create keyword");
                return StatusCode(500, new { message = "Error creating keyword", error = ex.Message });
            }
        }

        // PUT api/admin/accessibility/keywords/{id}
        [HttpPut("keywords/{id}")]
        public async Task<IActionResult> UpdateKeyword(int id, [FromBody] SmsKeyword keyword)
        {
            try
            {
                var existing = await _context.SmsKeywords.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Keyword not found" });

                existing.Keyword = keyword.Keyword;
                existing.Locale = keyword.Locale;
                existing.Active = keyword.Active;
                existing.Description = keyword.Description;
                existing.FlowId = keyword.FlowId;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update keyword");
                return StatusCode(500, new { message = "Error updating keyword", error = ex.Message });
            }
        }

        // DELETE api/admin/accessibility/keywords/{id}
        [HttpDelete("keywords/{id}")]
        public async Task<IActionResult> DeleteKeyword(int id)
        {
            try
            {
                var keyword = await _context.SmsKeywords.FindAsync(id);
                if (keyword == null)
                    return NotFound(new { message = "Keyword not found" });

                _context.SmsKeywords.Remove(keyword);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Keyword deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete keyword");
                return StatusCode(500, new { message = "Error deleting keyword", error = ex.Message });
            }
        }

        // GET api/admin/accessibility/flows
        [HttpGet("flows")]
        public async Task<IActionResult> GetFlows()
        {
            try
            {
                var flows = await _context.Flows
                    .OrderByDescending(f => f.CreatedAt)
                    .ToListAsync();

                return Ok(flows);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get flows");
                return StatusCode(500, new { message = "Error fetching flows", error = ex.Message });
            }
        }

        // POST api/admin/accessibility/flows
        [HttpPost("flows")]
        public async Task<IActionResult> CreateFlow([FromBody] Flow flow)
        {
            try
            {
                flow.CreatedAt = DateTime.UtcNow;
                _context.Flows.Add(flow);
                await _context.SaveChangesAsync();
                return Ok(flow);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create flow");
                return StatusCode(500, new { message = "Error creating flow", error = ex.Message });
            }
        }

        // PUT api/admin/accessibility/flows/{id}
        [HttpPut("flows/{id}")]
        public async Task<IActionResult> UpdateFlow(int id, [FromBody] Flow flow)
        {
            try
            {
                var existing = await _context.Flows.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Flow not found" });

                existing.Name = flow.Name;
                existing.Type = flow.Type;
                existing.Locale = flow.Locale;
                existing.Version = flow.Version;
                existing.NodesJson = flow.NodesJson;
                existing.EdgesJson = flow.EdgesJson;
                existing.DefaultEntryNodeId = flow.DefaultEntryNodeId;
                existing.Active = flow.Active;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update flow");
                return StatusCode(500, new { message = "Error updating flow", error = ex.Message });
            }
        }

        // DELETE api/admin/accessibility/flows/{id}
        [HttpDelete("flows/{id}")]
        public async Task<IActionResult> DeleteFlow(int id)
        {
            try
            {
                var flow = await _context.Flows.FindAsync(id);
                if (flow == null)
                    return NotFound(new { message = "Flow not found" });

                _context.Flows.Remove(flow);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Flow deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete flow");
                return StatusCode(500, new { message = "Error deleting flow", error = ex.Message });
            }
        }

        // GET api/admin/accessibility/routing-rules
        [HttpGet("routing-rules")]
        public async Task<IActionResult> GetRoutingRules()
        {
            try
            {
                var rules = await _context.RoutingRules
                    .Include(r => r.Flow)
                    .OrderBy(r => r.Priority)
                    .ToListAsync();

                return Ok(rules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get routing rules");
                return StatusCode(500, new { message = "Error fetching routing rules", error = ex.Message });
            }
        }

        // POST api/admin/accessibility/routing-rules
        [HttpPost("routing-rules")]
        public async Task<IActionResult> CreateRoutingRule([FromBody] RoutingRule rule)
        {
            try
            {
                _context.RoutingRules.Add(rule);
                await _context.SaveChangesAsync();
                return Ok(rule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create routing rule");
                return StatusCode(500, new { message = "Error creating routing rule", error = ex.Message });
            }
        }

        // PUT api/admin/accessibility/routing-rules/{id}
        [HttpPut("routing-rules/{id}")]
        public async Task<IActionResult> UpdateRoutingRule(int id, [FromBody] RoutingRule rule)
        {
            try
            {
                var existing = await _context.RoutingRules.FindAsync(id);
                if (existing == null)
                    return NotFound(new { message = "Routing rule not found" });

                existing.Channel = rule.Channel;
                existing.MatcherType = rule.MatcherType;
                existing.MatcherValue = rule.MatcherValue;
                existing.FlowId = rule.FlowId;
                existing.Priority = rule.Priority;
                existing.Active = rule.Active;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update routing rule");
                return StatusCode(500, new { message = "Error updating routing rule", error = ex.Message });
            }
        }

        // DELETE api/admin/accessibility/routing-rules/{id}
        [HttpDelete("routing-rules/{id}")]
        public async Task<IActionResult> DeleteRoutingRule(int id)
        {
            try
            {
                var rule = await _context.RoutingRules.FindAsync(id);
                if (rule == null)
                    return NotFound(new { message = "Routing rule not found" });

                _context.RoutingRules.Remove(rule);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Routing rule deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete routing rule");
                return StatusCode(500, new { message = "Error deleting routing rule", error = ex.Message });
            }
        }

        // GET api/admin/accessibility/content-targeting
        [HttpGet("content-targeting")]
        public async Task<IActionResult> GetContentTargeting()
        {
            try
            {
                var rules = await _context.ContentTargetings
                    .OrderBy(r => r.Priority)
                    .ToListAsync();

                return Ok(rules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get content targeting rules");
                return StatusCode(500, new { message = "Error fetching content targeting", error = ex.Message });
            }
        }

        // POST api/admin/accessibility/content-targeting
        [HttpPost("content-targeting")]
        public async Task<IActionResult> CreateContentTargeting([FromBody] ContentTargeting rule)
        {
            try
            {
                _context.ContentTargetings.Add(rule);
                await _context.SaveChangesAsync();
                return Ok(rule);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create content targeting");
                return StatusCode(500, new { message = "Error creating content targeting", error = ex.Message });
            }
        }

        // GET api/admin/accessibility/opt-ins
        [HttpGet("opt-ins")]
        public async Task<IActionResult> GetOptIns([FromQuery] string? phone = null)
        {
            try
            {
                var query = _context.OptIns.AsQueryable();

                if (!string.IsNullOrEmpty(phone))
                    query = query.Where(o => o.PhoneE164.Contains(phone));

                var optIns = await query
                    .OrderByDescending(o => o.UpdatedAt)
                    .Take(100)
                    .ToListAsync();

                return Ok(optIns);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get opt-ins");
                return StatusCode(500, new { message = "Error fetching opt-ins", error = ex.Message });
            }
        }

        // POST api/admin/accessibility/test-send
        [HttpPost("test-send")]
        public async Task<IActionResult> TestSend([FromBody] TestSendRequest request)
        {
            try
            {
                var result = await _gatewayProvider.SendSmsAsync(request.To, request.Message);

                var message = new GatewayMessage
                {
                    Direction = "out",
                    Channel = "sms",
                    PhoneE164 = request.To,
                    PayloadJson = JsonSerializer.Serialize(request),
                    Status = result.Status,
                    ErrorText = result.ErrorMessage,
                    CreatedAt = DateTime.UtcNow,
                    SentAt = result.Success ? DateTime.UtcNow : null
                };

                _context.GatewayMessages.Add(message);
                await _context.SaveChangesAsync();

                return Ok(new { success = result.Success, messageId = result.MessageId, error = result.ErrorMessage });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send test message");
                return StatusCode(500, new { message = "Error sending test message", error = ex.Message });
            }
        }
    }

    public class TestSendRequest
    {
        public string To { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}

