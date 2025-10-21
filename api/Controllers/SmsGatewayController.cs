using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.SMS;
using api.Services;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("api/gateway")]
    public class SmsGatewayController : ControllerBase
    {
        private readonly AQEDbContext _context;
        private readonly IGatewayProvider _gatewayProvider;
        private readonly ILogger<SmsGatewayController> _logger;

        public SmsGatewayController(
            AQEDbContext context,
            IGatewayProvider gatewayProvider,
            ILogger<SmsGatewayController> logger)
        {
            _context = context;
            _gatewayProvider = gatewayProvider;
            _logger = logger;
        }

        // POST api/gateway/sms/inbound
        [HttpPost("sms/inbound")]
        public async Task<IActionResult> ReceiveSms([FromBody] InboundSmsRequest request)
        {
            try
            {
                _logger.LogInformation("[SMS] Inbound from {From}: {Text}", request.From, request.Text);

                // Log incoming message
                var inboundMessage = new GatewayMessage
                {
                    Direction = "in",
                    Channel = "sms",
                    PhoneE164 = request.From,
                    PayloadJson = JsonSerializer.Serialize(request),
                    Status = "received",
                    CreatedAt = DateTime.UtcNow
                };
                _context.GatewayMessages.Add(inboundMessage);
                await _context.SaveChangesAsync();

                // Check opt-in status
                var optIn = await _context.OptIns
                    .FirstOrDefaultAsync(o => o.PhoneE164 == request.From && o.Channel == "sms");

                // Handle STOP/UNSTOP keywords
                var normalizedText = request.Text.Trim().ToUpperInvariant();
                if (normalizedText == "STOP" || normalizedText == "UNSUBSCRIBE")
                {
                    await HandleOptOut(request.From);
                    return Ok(new { message = "Opt-out processed" });
                }
                else if (normalizedText == "START" || normalizedText == "UNSTOP" || normalizedText == "SUBSCRIBE")
                {
                    await HandleOptIn(request.From, "sms_reply");
                    optIn = await _context.OptIns.FirstOrDefaultAsync(o => o.PhoneE164 == request.From && o.Channel == "sms");
                }

                // Check if opted in
                if (optIn == null || !optIn.OptedIn)
                {
                    // Send consent prompt
                    await SendSms(request.From, "Welcome to AQE! Reply START to receive learning materials via SMS. Msg&data rates may apply.");
                    return Ok(new { message = "Consent prompt sent" });
                }

                // Find matching routing rule
                var routingRule = await FindMatchingRoute(request.Text, "sms");
                if (routingRule == null)
                {
                    // No match, send help message
                    await SendSms(request.From, "Text START to begin learning, HELP for assistance, or STOP to opt out.");
                    return Ok(new { message = "Help sent" });
                }

                // Load or create session
                var session = await GetOrCreateSession(request.From, "sms", routingRule.FlowId, optIn.Locale);

                // Process message in flow
                await ProcessFlowMessage(session, request.Text);

                return Ok(new { message = "Processed", sessionId = session.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SMS] Inbound processing error");
                return StatusCode(500, new { message = "Error processing message", error = ex.Message });
            }
        }

        // POST api/gateway/ussd/inbound
        [HttpPost("ussd/inbound")]
        public async Task<IActionResult> ReceiveUssd([FromBody] InboundUssdRequest request)
        {
            try
            {
                _logger.LogInformation("[USSD] Session {SessionId} from {From}: {Input}", 
                    request.SessionId, request.From, request.Input);

                // Log incoming message
                var inboundMessage = new GatewayMessage
                {
                    Direction = "in",
                    Channel = "ussd",
                    PhoneE164 = request.From,
                    PayloadJson = JsonSerializer.Serialize(request),
                    Status = "received",
                    CreatedAt = DateTime.UtcNow
                };
                _context.GatewayMessages.Add(inboundMessage);
                await _context.SaveChangesAsync();

                // Find or create session
                var session = await _context.FlowSessions
                    .FirstOrDefaultAsync(s => s.PhoneE164 == request.From && s.Channel == "ussd" && s.ExpiresAt > DateTime.UtcNow);

                if (session == null)
                {
                    // New session, start default USSD flow
                    var defaultFlow = await _context.Flows
                        .FirstOrDefaultAsync(f => f.Type == "ussd" && f.Active);

                    if (defaultFlow == null)
                    {
                        return Ok(new { response = "END Service temporarily unavailable", sessionEnd = true });
                    }

                    session = new FlowSession
                    {
                        PhoneE164 = request.From,
                        Channel = "ussd",
                        FlowId = defaultFlow.Id,
                        StateJson = "{}",
                        Locale = "en",
                        ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.FlowSessions.Add(session);
                    await _context.SaveChangesAsync();
                }

                // Process USSD input
                var (response, endSession) = await ProcessUssdFlow(session, request.Input);

                if (endSession)
                {
                    session.ExpiresAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                var prefix = endSession ? "END " : "CON ";
                return Ok(new { response = prefix + response, sessionEnd = endSession });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[USSD] Inbound processing error");
                return Ok(new { response = "END Error processing request", sessionEnd = true });
            }
        }

        // Helper: Send SMS
        private async Task SendSms(string to, string body)
        {
            var result = await _gatewayProvider.SendSmsAsync(to, body);

            var outboundMessage = new GatewayMessage
            {
                Direction = "out",
                Channel = "sms",
                PhoneE164 = to,
                PayloadJson = JsonSerializer.Serialize(new { body }),
                Status = result.Status,
                ErrorText = result.ErrorMessage,
                CreatedAt = DateTime.UtcNow,
                SentAt = result.Success ? DateTime.UtcNow : null
            };

            _context.GatewayMessages.Add(outboundMessage);
            await _context.SaveChangesAsync();
        }

        // Helper: Handle opt-in
        private async Task HandleOptIn(string phone, string source)
        {
            var optIn = await _context.OptIns
                .FirstOrDefaultAsync(o => o.PhoneE164 == phone && o.Channel == "sms");

            if (optIn == null)
            {
                optIn = new OptIn
                {
                    PhoneE164 = phone,
                    Channel = "sms",
                    OptedIn = true,
                    ConsentSource = source,
                    ConsentAt = DateTime.UtcNow,
                    Locale = "en",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.OptIns.Add(optIn);
            }
            else
            {
                optIn.OptedIn = true;
                optIn.ConsentAt = DateTime.UtcNow;
                optIn.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            await SendSms(phone, "You're signed up! Text MATH, READING, or SCIENCE to start learning. Text STOP to opt out anytime.");
        }

        // Helper: Handle opt-out
        private async Task HandleOptOut(string phone)
        {
            var optIn = await _context.OptIns
                .FirstOrDefaultAsync(o => o.PhoneE164 == phone && o.Channel == "sms");

            if (optIn != null)
            {
                optIn.OptedIn = false;
                optIn.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            await SendSms(phone, "You've been unsubscribed. Text START to rejoin anytime.");
        }

        // Helper: Find matching route
        private async Task<RoutingRule?> FindMatchingRoute(string text, string channel)
        {
            var rules = await _context.RoutingRules
                .Where(r => r.Channel == channel && r.Active)
                .OrderBy(r => r.Priority)
                .ToListAsync();

            var normalizedText = text.Trim().ToUpperInvariant();

            foreach (var rule in rules)
            {
                switch (rule.MatcherType)
                {
                    case "keyword":
                        if (normalizedText == rule.MatcherValue.ToUpperInvariant())
                            return rule;
                        break;
                    case "starts_with":
                        if (normalizedText.StartsWith(rule.MatcherValue.ToUpperInvariant()))
                            return rule;
                        break;
                    case "regex":
                        // TODO: Implement regex matching
                        break;
                }
            }

            return null;
        }

        // Helper: Get or create session
        private async Task<FlowSession> GetOrCreateSession(string phone, string channel, int flowId, string locale)
        {
            var session = await _context.FlowSessions
                .FirstOrDefaultAsync(s => s.PhoneE164 == phone && s.Channel == channel && s.ExpiresAt > DateTime.UtcNow);

            if (session == null)
            {
                session = new FlowSession
                {
                    PhoneE164 = phone,
                    Channel = channel,
                    FlowId = flowId,
                    StateJson = "{}",
                    Locale = locale,
                    ExpiresAt = DateTime.UtcNow.AddHours(24),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.FlowSessions.Add(session);
                await _context.SaveChangesAsync();
            }

            return session;
        }

        // Helper: Process flow message (simplified)
        private async Task ProcessFlowMessage(FlowSession session, string input)
        {
            // This is a simplified flow processor
            // In production, this would be a full state machine engine

            var state = JsonSerializer.Deserialize<Dictionary<string, string>>(session.StateJson) 
                ?? new Dictionary<string, string>();

            // Example flow: collect grade → subject → deliver content
            if (!state.ContainsKey("grade"))
            {
                // Ask for grade
                state["grade"] = input.Trim();
                await SendSms(session.PhoneE164, "Great! What subject? Reply: MATH, READING, or SCIENCE");
            }
            else if (!state.ContainsKey("subject"))
            {
                state["subject"] = input.Trim().ToUpperInvariant();
                
                // Find content
                var content = await _context.ContentTargetings
                    .FirstOrDefaultAsync(c => 
                        c.Subject == state["subject"] && 
                        c.GradeBand == state["grade"] &&
                        c.Active);

                if (content != null)
                {
                    await SendSms(session.PhoneE164, $"Perfect! Starting your {state["subject"]} lesson. Check back soon for your first question!");
                    state["content_id"] = content.Id.ToString();
                }
                else
                {
                    await SendSms(session.PhoneE164, "Sorry, we don't have content for that combination yet. Text START to try again.");
                }
            }

            session.StateJson = JsonSerializer.Serialize(state);
            session.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        // Helper: Process USSD flow (simplified)
        private async Task<(string response, bool endSession)> ProcessUssdFlow(FlowSession session, string input)
        {
            // Simplified USSD menu
            var state = JsonSerializer.Deserialize<Dictionary<string, string>>(session.StateJson) 
                ?? new Dictionary<string, string>();

            if (string.IsNullOrEmpty(input))
            {
                // Initial menu
                return ("Welcome to AQE\n1. Math\n2. Reading\n3. Science\n0. Exit", false);
            }

            if (!state.ContainsKey("subject"))
            {
                // Handle subject selection
                var subject = input switch
                {
                    "1" => "MATH",
                    "2" => "READING",
                    "3" => "SCIENCE",
                    "0" => "EXIT",
                    _ => null
                };

                if (subject == "EXIT")
                {
                    return ("Thank you for using AQE!", true);
                }

                if (subject == null)
                {
                    return ("Invalid choice. Please try again.\n1. Math\n2. Reading\n3. Science\n0. Exit", false);
                }

                state["subject"] = subject;
                session.StateJson = JsonSerializer.Serialize(state);
                await _context.SaveChangesAsync();

                return ($"Choose grade:\n1. K-2\n2. 3-4\n3. 5-6\n4. 7-8\n0. Back", false);
            }

            // Handle grade selection
            var grade = input switch
            {
                "1" => "K-2",
                "2" => "3-4",
                "3" => "5-6",
                "4" => "7-8",
                "0" => "BACK",
                _ => null
            };

            if (grade == "BACK")
            {
                state.Remove("subject");
                session.StateJson = JsonSerializer.Serialize(state);
                await _context.SaveChangesAsync();
                return ("Welcome to AQE\n1. Math\n2. Reading\n3. Science\n0. Exit", false);
            }

            if (grade == null)
            {
                return ("Invalid choice. Try again.\n1. K-2\n2. 3-4\n3. 5-6\n4. 7-8\n0. Back", false);
            }

            return ($"Perfect! We'll send {state["subject"]} lessons for grade {grade} to this number via SMS. Text START to begin!", true);
        }
    }

    // Request models
    public class InboundSmsRequest
    {
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public Dictionary<string, string>? ProviderMeta { get; set; }
    }

    public class InboundUssdRequest
    {
        public string From { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public string UssdCode { get; set; } = string.Empty;
        public string Input { get; set; } = string.Empty;
    }
}

