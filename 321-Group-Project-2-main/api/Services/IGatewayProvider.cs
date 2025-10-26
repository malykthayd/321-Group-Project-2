namespace api.Services
{
    public interface IGatewayProvider
    {
        Task<SendSmsResult> SendSmsAsync(string to, string body);
        Task<SendUssdResult> ReplyUssdAsync(string sessionId, string body, bool endSession = false);
        Task<bool> VerifyNumberAsync(string phoneNumber);
        string GetProviderName();
    }

    public class SendSmsResult
    {
        public bool Success { get; set; }
        public string? MessageId { get; set; }
        public string? ErrorMessage { get; set; }
        public string Status { get; set; } = "queued"; // queued, sent, failed
    }

    public class SendUssdResult
    {
        public bool Success { get; set; }
        public string? SessionId { get; set; }
        public string? ErrorMessage { get; set; }
        public bool SessionEnded { get; set; }
    }
}

