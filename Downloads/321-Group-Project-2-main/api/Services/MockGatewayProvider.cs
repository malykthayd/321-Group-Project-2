using System.Text.Json;

namespace api.Services
{
    public class MockGatewayProvider : IGatewayProvider
    {
        private readonly ILogger<MockGatewayProvider> _logger;
        private readonly Dictionary<string, string> _sessions = new();

        public MockGatewayProvider(ILogger<MockGatewayProvider> logger)
        {
            _logger = logger;
        }

        public string GetProviderName() => "mock";

        public async Task<SendSmsResult> SendSmsAsync(string to, string body)
        {
            await Task.Delay(100); // Simulate network delay
            
            _logger.LogInformation("[MockGateway] SMS to {To}: {Body}", to, body);

            // Simulate successful send
            return new SendSmsResult
            {
                Success = true,
                MessageId = $"mock_{Guid.NewGuid():N}",
                Status = "sent"
            };
        }

        public async Task<SendUssdResult> ReplyUssdAsync(string sessionId, string body, bool endSession = false)
        {
            await Task.Delay(100); // Simulate network delay
            
            _logger.LogInformation("[MockGateway] USSD Session {SessionId}: {Body} (End: {EndSession})", 
                sessionId, body, endSession);

            if (endSession)
            {
                _sessions.Remove(sessionId);
            }
            else
            {
                _sessions[sessionId] = body;
            }

            return new SendUssdResult
            {
                Success = true,
                SessionId = sessionId,
                SessionEnded = endSession
            };
        }

        public async Task<bool> VerifyNumberAsync(string phoneNumber)
        {
            await Task.Delay(50); // Simulate network delay
            
            _logger.LogInformation("[MockGateway] Verifying number: {PhoneNumber}", phoneNumber);
            
            // Mock provider accepts any number
            return true;
        }
    }
}

