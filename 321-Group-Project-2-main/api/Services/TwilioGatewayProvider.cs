using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace api.Services
{
    public class TwilioGatewayProvider : IGatewayProvider
    {
        private readonly ILogger<TwilioGatewayProvider> _logger;
        private readonly IConfiguration _configuration;
        private readonly string? _accountSid;
        private readonly string? _authToken;
        private readonly string? _messagingServiceSid;
        private readonly string? _fromNumber;

        public TwilioGatewayProvider(
            ILogger<TwilioGatewayProvider> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            
            _accountSid = _configuration["Twilio:AccountSid"];
            _authToken = _configuration["Twilio:AuthToken"];
            _messagingServiceSid = _configuration["Twilio:MessagingServiceSid"];
            _fromNumber = _configuration["Gateway:SmsNumber"];
            
            // Initialize Twilio client
            if (!string.IsNullOrEmpty(_accountSid) && !string.IsNullOrEmpty(_authToken))
            {
                TwilioClient.Init(_accountSid, _authToken);
            }
        }

        public string GetProviderName() => "twilio";

        public async Task<SendSmsResult> SendSmsAsync(string to, string body)
        {
            if (string.IsNullOrEmpty(_accountSid) || string.IsNullOrEmpty(_authToken))
            {
                _logger.LogError("[TwilioGateway] Missing credentials");
                return new SendSmsResult
                {
                    Success = false,
                    ErrorMessage = "Twilio credentials not configured",
                    Status = "failed"
                };
            }

            if (string.IsNullOrEmpty(_fromNumber))
            {
                _logger.LogError("[TwilioGateway] Missing from number");
                return new SendSmsResult
                {
                    Success = false,
                    ErrorMessage = "SMS from number not configured",
                    Status = "failed"
                };
            }

            try
            {
                _logger.LogInformation("[TwilioGateway] Sending SMS to {To}: {Body}", to, body);

                var message = await MessageResource.CreateAsync(
                    body: body,
                    from: new PhoneNumber(_fromNumber),
                    to: new PhoneNumber(to)
                );

                _logger.LogInformation("[TwilioGateway] SMS sent successfully. SID: {Sid}, Status: {Status}", 
                    message.Sid, message.Status);

                return new SendSmsResult
                {
                    Success = true,
                    MessageId = message.Sid,
                    Status = message.Status.ToString().ToLower()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[TwilioGateway] Failed to send SMS to {To}", to);
                return new SendSmsResult
                {
                    Success = false,
                    ErrorMessage = ex.Message,
                    Status = "failed"
                };
            }
        }

        public async Task<SendUssdResult> ReplyUssdAsync(string sessionId, string body, bool endSession = false)
        {
            // USSD typically requires specific aggregator integration
            // This is a placeholder
            _logger.LogWarning("[TwilioGateway] USSD not fully implemented for Twilio");
            
            return new SendUssdResult
            {
                Success = false,
                ErrorMessage = "USSD not supported in Twilio provider",
                SessionEnded = true
            };
        }

        public async Task<bool> VerifyNumberAsync(string phoneNumber)
        {
            try
            {
                // TODO: Use Twilio Lookup API
                _logger.LogInformation("[TwilioGateway] Would verify number: {PhoneNumber}", phoneNumber);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[TwilioGateway] Number verification failed");
                return false;
            }
        }
    }
}

