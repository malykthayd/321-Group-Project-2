# Twilio SMS Setup Guide

This guide will help you set up real SMS functionality using Twilio for the AQE platform.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com)
2. A verified phone number for testing
3. A Twilio phone number for sending SMS

## Step 1: Get Twilio Credentials

1. **Log into your Twilio Console**: https://console.twilio.com
2. **Find your Account SID and Auth Token**:
   - Go to the Dashboard
   - Copy your "Account SID" and "Auth Token"
   - Keep these secure - they provide full access to your Twilio account

## Step 2: Get a Twilio Phone Number

1. **Purchase a phone number**:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number with SMS capabilities
   - Note the phone number (e.g., +1234567890)

## Step 3: Configure the Application

1. **Update `api/appsettings.json`**:
   ```json
   {
     "Gateway": {
       "Provider": "twilio",
       "SmsNumber": "+1234567890",
       "UssdCode": "*123#"
     },
     "Twilio": {
       "AccountSid": "YOUR_ACCOUNT_SID_HERE",
       "AuthToken": "YOUR_AUTH_TOKEN_HERE",
       "MessagingServiceSid": ""
     }
   }
   ```

2. **Replace the placeholder values**:
   - `YOUR_ACCOUNT_SID_HERE` with your actual Account SID
   - `YOUR_AUTH_TOKEN_HERE` with your actual Auth Token
   - `+1234567890` with your actual Twilio phone number

## Step 4: Set Up Webhook (Optional but Recommended)

To receive incoming SMS messages, you need to configure a webhook URL in Twilio:

1. **Get your webhook URL**:
   - If running locally: `https://your-ngrok-url.ngrok.io/api/gateway/twilio/webhook`
   - If deployed: `https://your-domain.com/api/gateway/twilio/webhook`

2. **Configure in Twilio Console**:
   - Go to Phone Numbers → Manage → Active numbers
   - Click on your SMS-enabled number
   - In the "Messaging" section, set:
     - Webhook URL: `https://your-webhook-url/api/gateway/twilio/webhook`
     - HTTP Method: POST

## Step 5: Test the Setup

1. **Start the API**:
   ```bash
   cd api
   dotnet run
   ```

2. **Test sending SMS**:
   - Go to the admin panel
   - Navigate to SMS/USSD section
   - Use the test functionality to send SMS to your phone

3. **Test receiving SMS**:
   - Send an SMS to your Twilio number
   - Check the admin panel to see if it was received

## Step 6: Production Considerations

### Security
- Never commit your Twilio credentials to version control
- Use environment variables or Azure Key Vault for production
- Consider using Twilio's Messaging Service for better deliverability

### Environment Variables (Recommended)
Instead of hardcoding credentials, use environment variables:

```bash
export TWILIO_ACCOUNT_SID="your_account_sid"
export TWILIO_AUTH_TOKEN="your_auth_token"
export TWILIO_FROM_NUMBER="+1234567890"
```

Then update `appsettings.json`:
```json
"Twilio": {
  "AccountSid": "${TWILIO_ACCOUNT_SID}",
  "AuthToken": "${TWILIO_AUTH_TOKEN}",
  "MessagingServiceSid": ""
},
"Gateway": {
  "Provider": "twilio",
  "SmsNumber": "${TWILIO_FROM_NUMBER}",
  "UssdCode": "*123#"
}
```

### Webhook Security
- Implement webhook signature validation for production
- Use HTTPS for webhook URLs
- Consider rate limiting

## Troubleshooting

### Common Issues

1. **"Invalid phone number"**:
   - Ensure phone numbers are in E.164 format (+1234567890)
   - Verify the number is valid using Twilio's Lookup API

2. **"Authentication failed"**:
   - Double-check your Account SID and Auth Token
   - Ensure there are no extra spaces or characters

3. **"Webhook not receiving messages"**:
   - Verify the webhook URL is accessible
   - Check that the webhook is configured in Twilio Console
   - Ensure your server is running and accessible

4. **"SMS not delivered"**:
   - Check Twilio's message logs in the console
   - Verify the destination number is valid
   - Check for any carrier restrictions

### Testing Commands

Test the API directly:
```bash
# Test sending SMS
curl -X POST http://localhost:5001/api/gateway/test/send \
  -H "Content-Type: application/json" \
  -d '{"from": "+1234567890", "text": "Test message"}'

# Test receiving SMS
curl -X POST http://localhost:5001/api/gateway/test/sms \
  -H "Content-Type: application/json" \
  -d '{"from": "+1234567890", "text": "START"}'
```

## Cost Considerations

- Twilio charges per SMS sent and received
- Check current pricing at https://www.twilio.com/pricing
- Consider setting up usage alerts in Twilio Console
- For high volume, contact Twilio for custom pricing

## Next Steps

1. Set up monitoring and logging
2. Implement message queuing for high volume
3. Add support for MMS and other message types
4. Consider implementing message templates
5. Set up analytics and reporting

## Support

- Twilio Documentation: https://www.twilio.com/docs
- Twilio Support: https://support.twilio.com
- AQE Platform Issues: Contact your development team
