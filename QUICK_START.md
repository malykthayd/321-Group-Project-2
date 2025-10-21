# AQE Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- .NET 9 SDK installed
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Terminal/Command Prompt

---

## Starting the Application

### 1. Start the API Server

```bash
cd /Users/jaimeeodouglas/Desktop/aqe/api
dotnet run
```

**Expected output:**
```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

### 2. Open the Client

Open your browser and navigate to:
```
/Users/jaimeeodouglas/Desktop/aqe/client/index.html
```

Or use a local server (recommended for PWA features):
```bash
cd /Users/jaimeeodouglas/Desktop/aqe/client
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

---

## Demo Accounts

### Student Account
- **Email**: `student@demo.com`
- **Password**: `student123`

### Teacher Account
- **Email**: `teacher@demo.com`
- **Password**: `teacher123`

### Parent Account
- **Email**: `parent@demo.com`
- **Password**: `parent123`

### Admin Account
- **Email**: `admin@demo.com`
- **Password**: `admin123`

---

## Testing New Features

### ✅ Test PWA Offline Mode

1. Open the site in Chrome/Edge
2. Open DevTools (F12)
3. Go to **Application** tab
4. Check **Service Workers** - should show "activated and running"
5. Go to **Network** tab
6. Check "Offline" checkbox
7. Refresh the page
8. **Site should still work!** ✅

### ✅ Test PWA Installation

1. Look for "Install" button in browser address bar
2. Or check for "Install App" button in the header
3. Click to install
4. App opens in standalone window
5. Check your desktop/applications - AQE is now installed!

### ✅ Test SMS/USSD Admin Suite

1. Login as admin (`admin@demo.com` / `admin123`)
2. Click **"SMS/USSD"** tab
3. See Overview dashboard with:
   - Gateway provider (Mock)
   - SMS number: +15551234567
   - USSD code: *123#
   - Today's stats (all zeros initially)
4. Click **"Messages"** tab - see message log (empty initially)
5. Click **"Test Send SMS"** button
6. Enter:
   - To: `+1234567890`
   - Message: `Hello from AQE!`
7. Click **Send**
8. Success message appears ✅
9. Go back to **"Messages"** tab
10. See your test message in the log! ✅

### ✅ Test Offline Learning

1. Login as student
2. Go to a lesson
3. Turn on Airplane Mode (or DevTools offline mode)
4. Complete a quiz question
5. Answer is saved locally in IndexedDB
6. Turn off Airplane Mode
7. Data automatically syncs to server! ✅

---

## API Endpoints (for testing)

### PWA Endpoints (existing, now work offline)
- `GET /api/auth/demo-accounts` - Get demo account list
- `GET /api/student/{id}/dashboard` - Student dashboard
- `GET /api/teacher/{id}/dashboard` - Teacher dashboard
- `GET /api/parent/{id}/dashboard` - Parent dashboard

### New SMS/USSD Endpoints
- `GET /api/admin/accessibility/overview` - Dashboard stats
- `GET /api/admin/accessibility/messages` - Message log
- `GET /api/admin/accessibility/keywords` - SMS keywords
- `GET /api/admin/accessibility/flows` - Conversation flows
- `POST /api/admin/accessibility/test-send` - Send test SMS
- `POST /api/gateway/sms/inbound` - Receive SMS (webhook)
- `POST /api/gateway/ussd/inbound` - Receive USSD (webhook)

---

## Testing with cURL

### Test API is running:
```bash
curl http://localhost:5000/api/auth/demo-accounts
```

### Test SMS Overview:
```bash
curl http://localhost:5000/api/admin/accessibility/overview
```

### Send Test SMS:
```bash
curl -X POST http://localhost:5000/api/admin/accessibility/test-send \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "message": "Test from API"}'
```

### Simulate Inbound SMS:
```bash
curl -X POST http://localhost:5000/api/gateway/sms/inbound \
  -H "Content-Type: application/json" \
  -d '{"from": "+1234567890", "to": "+15551234567", "text": "START"}'
```

---

## Verifying Database

The SQLite database is created at: `/Users/jaimeeodouglas/Desktop/aqe/api/aqe.db`

### View tables:
```bash
cd /Users/jaimeeodouglas/Desktop/aqe/api
sqlite3 aqe.db ".tables"
```

**Expected tables (partial list):**
- Users
- Students
- Teachers
- Parents
- Admins
- Lessons
- GatewayNumbers
- SmsKeywords
- Flows
- FlowSessions
- GatewayMessages
- RoutingRules
- ContentTargetings
- OptIns

### Check SMS messages:
```bash
sqlite3 aqe.db "SELECT * FROM GatewayMessages;"
```

---

## Troubleshooting

### API won't start
**Error**: `Unable to bind to http://localhost:5000`
**Solution**: Port 5000 is in use. Kill existing process:
```bash
pkill -f "dotnet.*run"
```

### PWA not working
**Issue**: Service worker not registering
**Solution**: Must use HTTPS or localhost. If using file://, switch to http.server:
```bash
cd client
python3 -m http.server 8000
```

### SMS module shows "Loading..."
**Issue**: API not responding
**Solution**: Check API is running on port 5000:
```bash
curl http://localhost:5000/api/admin/accessibility/overview
```

### Database errors
**Issue**: Table doesn't exist
**Solution**: Delete and recreate database:
```bash
cd api
rm aqe.db
dotnet run
```

---

## Development Workflow

### Make Changes to API:
1. Edit files in `/api`
2. Stop API (Ctrl+C)
3. Restart: `dotnet run`
4. Database auto-recreates on start

### Make Changes to Client:
1. Edit files in `/client`
2. Refresh browser
3. **For service worker changes**: 
   - Hard refresh (Ctrl+Shift+R)
   - Or DevTools → Application → Service Workers → "Unregister"

### Update PWA:
1. Edit `/client/service-worker.js`
2. Update `CACHE_VERSION` (e.g., 'aqe-v2')
3. Hard refresh browser
4. Users see "Update Available" notification

---

## What's New?

### ✨ PWA Features:
- **Offline Mode**: Works without internet
- **Installable**: Add to home screen/desktop
- **Fast Loading**: Instant with caching
- **Background Sync**: Auto-sync when online
- **IndexedDB**: Local data storage

### 📱 SMS/USSD Features:
- **Admin Dashboard**: Manage SMS/USSD flows
- **Mock Gateway**: Test without real SMS
- **Message Logs**: Full audit trail
- **Smart Routing**: Keywords → Flows
- **Content Targeting**: Grade/Subject → Lessons
- **Compliance**: Auto opt-in/opt-out

---

## Next Steps

1. **Create Your First Flow**:
   - Admin → SMS/USSD → Flows → Create
   - Add nodes for conversation steps
   - Link to keywords

2. **Set Up Content Targeting**:
   - Admin → SMS/USSD → Content Targeting
   - Map grade bands to lessons
   - Test with "START" keyword

3. **Go Production**:
   - Sign up for Twilio
   - Update `appsettings.json`
   - Set webhook URL in Twilio console

---

## Support

For issues or questions:
- Check `/Users/jaimeeodouglas/Desktop/aqe/IMPLEMENTATION_SUMMARY.md`
- Review API logs in terminal
- Check browser DevTools console
- Inspect `/tmp/aqe-api.log` for background API logs

---

**🎉 Enjoy your new offline-first, SMS-enabled AQE platform!**

