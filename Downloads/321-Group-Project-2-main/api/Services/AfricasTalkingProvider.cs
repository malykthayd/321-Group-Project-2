using System.Text.Json;

namespace api.Services
{
    public class AfricasTalkingProvider : IGatewayProvider
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AfricasTalkingProvider> _logger;
        private readonly IConfiguration _configuration;

        public AfricasTalkingProvider(HttpClient httpClient, ILogger<AfricasTalkingProvider> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _configuration = configuration;
        }

        public string GetProviderName() => "africastalking";

        public async Task<SendSmsResult> SendSmsAsync(string to, string body)
        {
            try
            {
                var username = _configuration["Gateway:AfricasTalking:Username"];
                var apiKey = _configuration["Gateway:AfricasTalking:ApiKey"];
                var senderId = _configuration["Gateway:AfricasTalking:SenderId"] ?? "AQE";

                var requestBody = new Dictionary<string, string>
                {
                    ["username"] = username ?? "",
                    ["to"] = to,
                    ["message"] = body
                };

                if (!string.IsNullOrEmpty(senderId))
                {
                    requestBody["from"] = senderId;
                }

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("apiKey", apiKey);

                var content = new FormUrlEncodedContent(requestBody);
                var response = await _httpClient.PostAsync("https://api.africastalking.com/version1/messaging", content);

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("[Africa's Talking] SMS Response: {Response}", responseContent);

                if (response.IsSuccessStatusCode)
                {
                    return new SendSmsResult
                    {
                        Success = true,
                        MessageId = Guid.NewGuid().ToString("N"),
                        Status = "sent"
                    };
                }

                return new SendSmsResult
                {
                    Success = false,
                    ErrorMessage = responseContent,
                    Status = "failed"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Africa's Talking] SMS Error");
                return new SendSmsResult
                {
                    Success = false,
                    ErrorMessage = ex.Message,
                    Status = "failed"
                };
            }
        }

        public Task<SendUssdResult> ReplyUssdAsync(string sessionId, string body, bool endSession = false)
        {
            // For Africa's Talking USSD, the response format is:
            // "CON <message>" to continue
            // "END <message>" to end session
            
            var prefix = endSession ? "END " : "CON ";
            _logger.LogInformation("[Africa's Talking] USSD {SessionId}: {Prefix}{Body}", sessionId, prefix, body);

            return Task.FromResult(new SendUssdResult
            {
                Success = true,
                SessionId = sessionId,
                SessionEnded = endSession
            });
        }

        public Task<bool> VerifyNumberAsync(string phoneNumber)
        {
            // Africa's Talking accepts any valid phone number
            _logger.LogInformation("[Africa's Talking] Verifying number: {PhoneNumber}", phoneNumber);
            return Task.FromResult(true);
        }
    }
}

