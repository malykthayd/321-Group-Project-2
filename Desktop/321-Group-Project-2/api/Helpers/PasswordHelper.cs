using System.Security.Cryptography;
using System.Text;

namespace api.Helpers
{
    public static class PasswordHelper
    {
        // Hash a password using SHA256 (simple but better than plain text)
        // In production, use BCrypt or Argon2
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        // Verify a password against a hash
        public static bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return hash == hashOfInput;
        }
    }
}

