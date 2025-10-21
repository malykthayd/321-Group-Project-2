# AQE Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Starting the Platform

#### 1. Start the API Server
```bash
cd /Users/jaimeeodouglas/Desktop/aqe/api
dotnet run --urls "http://localhost:5000"
```

Wait for the message: `Now listening on: http://localhost:5000`

#### 2. Open the Website
Simply open `client/index.html` in your web browser or use Live Server in VS Code.

## ✨ Key Features Now Working

### ✅ Registration & Login
- **Registration creates real database entries**
- **Only registered users can login**
- All 4 user roles supported (Student, Teacher, Parent, Admin)

### ✅ Dark Mode
- **Click the moon/sun icon** in the header (desktop) or mobile menu
- **Entire site switches** to dark theme
- **All text remains readable** with proper contrast
- **Preference is saved** - stays dark/light when you return

### ✅ Translation System
- **6 languages supported**: English, Spanish, French, German, Chinese, Arabic
- **Select language** from dropdown in header
- **Entire UI translates instantly** including:
  - Navigation menus
  - Buttons and forms
  - Role descriptions
  - Dashboard content
  - Modal dialogs

## 📝 Testing Registration & Login

### Test Student Registration
1. Click "Login" button in Getting Started
2. Switch to "Register" tab
3. Select "Student" role
4. Fill in:
   - Name: Your Name
   - Email: yourname@example.com
   - Password: (min 8 characters)
   - Grade Level: Select one
5. Click "Register"
6. **You're automatically logged in!**

### Test Teacher Registration
1. Follow same steps but select "Teacher" role
2. Choose grade level you teach
3. After registration, you can:
   - Add students (generates access codes)
   - Create practice materials
   - Assign lessons
   - View student progress

### Test Parent Registration
1. Select "Parent" role
2. Fill in your information
3. **Important**: Click "Add Child" button
4. Enter child's name and access code
   - Use demo student code: `123456` and name: `Demo Student`
5. Can add multiple children
6. Click "Register"

### Test Login
1. Try logging in with credentials you registered
2. Or use demo accounts:
   - **Student**: student@demo.com / student123
   - **Teacher**: teacher@demo.com / teacher123
   - **Parent**: parent@demo.com / parent123
   - **Admin**: admin@demo.com / admin123

## 🌓 Testing Dark Mode

1. Look for the **moon icon** (☾) in the header next to language selector
2. Click it - entire site turns dark
3. Check different pages:
   - Dashboard
   - Login modal
   - Forms
   - Cards
4. All text should be clearly readable
5. Click **sun icon** (☀) to switch back to light mode

## 🌍 Testing Translations

1. Find the **language dropdown** in the header (shows current language)
2. Click and select a different language:
   - Español (Spanish)
   - Français (French)
   - Deutsch (German)
   - 中文 (Chinese)
   - العربية (Arabic)
3. Watch the **entire interface** translate instantly
4. Try clicking buttons - tooltips and messages also translate
5. Open the login modal - even form labels are translated!

## 🔍 What Data is Tracked?

### For Students
- ✅ Lessons checked out, started, completed
- ✅ Scores and accuracy rates
- ✅ Practice materials progress
- ✅ Badges earned
- ✅ Study streaks
- ✅ Time spent learning

### For Teachers
- ✅ Total students in class
- ✅ Students added (with access codes)
- ✅ Practice materials created
- ✅ Assignments given
- ✅ Class average scores
- ✅ Individual student performance

### For Parents
- ✅ All linked children's progress
- ✅ Lessons completed per child
- ✅ Average scores per child
- ✅ Recent activity across all children
- ✅ Assigned vs completed work

## 🎯 Role-Specific Features

### Student Dashboard
- View assigned lessons
- Check out lessons to "My Work"
- Complete lessons and record scores
- View personal statistics
- See earned badges
- Track progress

### Teacher Dashboard
- Add students (generates unique access codes)
- Create practice materials with questions
- Assign lessons to individuals or whole class
- View student performance
- Monitor completion rates
- Regenerate access codes

### Parent Dashboard
- View all children's accounts
- See combined statistics
- Assign additional lessons
- Monitor progress across all children
- View recent activity
- Check individual child performance

### Admin Dashboard
- Manage all users
- Create digital library content
- View system-wide statistics
- Manage platform settings

## 🗄️ Database Information

- **Type**: SQLite (file-based)
- **Location**: `api/aqe.db`
- **Auto-created**: On first API run
- **Includes**: Demo accounts for all roles

### Tables Created
- Users (main account table)
- Students, Teachers, Parents, Admins
- StudentLessons (progress tracking)
- StudentPracticeMaterials (assignments)
- StudentBadges (achievements)
- StudentStatistics (comprehensive metrics)
- ParentStudents (parent-child links)
- And more...

## 🔐 Security Features

✅ **Password validation** - Minimum 8 characters
✅ **Email uniqueness** - Prevents duplicate accounts
✅ **Role-based access** - Users only see their role's features
✅ **Session management** - Login state persists
✅ **Access codes** - Secure parent-child linking

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar navigation
- **Mobile**: Bottom navigation bar
- **Tablet**: Optimized layouts
- **Dark Mode**: Works on all devices
- **Touch-friendly**: All buttons and links easily tappable

## 🐛 Troubleshooting

### API won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill any process using it
kill -9 <PID>

# Try starting again
cd api && dotnet run
```

### Registration fails
- Check API is running (look for console output)
- Verify email is unique
- Password must be 8+ characters
- For parent registration, child access codes must be valid

### Dark mode doesn't work
- Clear browser cache
- Check browser console for errors
- Try refreshing the page

### Translations not appearing
- Make sure JavaScript is enabled
- Clear browser cache
- Check browser console for errors

## 📊 API Endpoints

All endpoints start with `http://localhost:5000/api/`

### Authentication
- POST `/auth/login` - Login with email/password
- POST `/auth/register-student` - Create student account
- POST `/auth/register-teacher` - Create teacher account
- POST `/auth/register-parent` - Create parent account
- POST `/auth/register-admin` - Create admin account
- GET `/auth/demo-accounts` - List demo accounts

### Statistics
- GET `/statistics/student/{id}` - Student progress
- GET `/statistics/student/{id}/badges` - Student badges
- GET `/statistics/teacher/{id}/overview` - Teacher dashboard
- GET `/statistics/parent/{id}/overview` - Parent dashboard

### Teacher Operations
- GET `/teacher/{id}/students` - List students
- POST `/teacher/{id}/students` - Add student
- POST `/teacher/{id}/practice-materials` - Create material

### Parent Operations
- GET `/parent/{id}/children` - List children
- POST `/parent/{id}/assign-lesson` - Assign lesson to child

### Student Operations
- GET `/student/{id}/dashboard` - Student dashboard
- POST `/student/{id}/checkout-lesson` - Checkout lesson
- POST `/student/{id}/complete-lesson` - Complete lesson

## 🎨 Customization

### Changing Colors (Dark Mode)
Edit `client/resources/styles/dark-mode.css`:
```css
:root {
  --dark-bg-primary: #1a202c;    /* Main background */
  --dark-text-primary: #f7fafc;   /* Main text */
  --dark-accent: #667eea;         /* Accent color */
  /* ... more variables */
}
```

### Adding More Languages
Edit `client/resources/scripts/translations.js`:
```javascript
const translations = {
  en: { /* English translations */ },
  es: { /* Spanish translations */ },
  // Add new language here
  it: { /* Italian translations */ }
};
```

## 📈 Next Steps

1. **Test thoroughly** - Try all features
2. **Customize branding** - Update colors, logos
3. **Add content** - Create lessons as admin
4. **Invite users** - Share registration link
5. **Monitor usage** - Check statistics dashboard

## 💡 Tips

- **Access codes are 6 digits** - Teachers generate them for students
- **Parents need access codes** - To link to children's accounts
- **Dark mode persists** - Your preference is saved
- **Language persists** - Selected language is remembered
- **Demo accounts** - Perfect for testing all features
- **Stats update automatically** - When students complete work

## 🆘 Need Help?

- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- Review browser console for errors
- Ensure API is running on port 5000
- Verify database file (`api/aqe.db`) exists

## ✅ Verification Checklist

- [ ] API starts without errors
- [ ] Website opens in browser
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] Dark mode toggles properly
- [ ] All text readable in dark mode
- [ ] Language selector works
- [ ] UI translates completely
- [ ] Dashboard shows correct role
- [ ] Statistics display properly

---

**Everything is now fully functional!** 🎉

Your AQE platform has:
- ✅ Complete authentication system
- ✅ Database-backed registration
- ✅ Full dark mode with readable contrast
- ✅ 6-language translation support
- ✅ Role-based dashboards
- ✅ Student activity tracking
- ✅ Teacher classroom management
- ✅ Parent monitoring tools

**Start exploring and enjoy your platform!**

