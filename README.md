# Accessible Quality Education (AQE)

An offline-capable, role-based learning platform designed to improve access to quality education through adaptive learning, gamified lessons, and digital library management.

## Features

### Core Features
- **Resource Hub**: Centralized dashboard for lessons, readings, practice materials, and progress analytics
- **Role-Based Access**: Distinct experiences for Students, Teachers, Parents/Guardians, and Administrators
- **Adaptive Learning**: AI-powered difficulty adjustment based on student mastery
- **Digital Library**: Gamified book checkout system with paired comprehension lessons
- **Offline-First**: PWA with offline caching and background sync
- **Multilingual Support**: Interface and content translation system
- **SMS/USSD Integration**: Learning flows via SMS and USSD for low-connectivity environments

### Technical Features
- **SQLite Database**: Local data persistence with sync capabilities
- **Progressive Web App**: Installable with offline functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: Role-based authentication and data encryption

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT with bcrypt password hashing
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **PWA**: Workbox for service worker management

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd accessible-quality-education
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your-secret-key-here
   SMS_GATEWAY_URL=https://api.sms-gateway.com/send
   SMS_GATEWAY_API_KEY=your-sms-api-key
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

The seeding script creates demo accounts for each role:

- **Student**: `student@demo.com` / `demo123`
- **Teacher**: `teacher@demo.com` / `demo123`
- **Parent**: `parent@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── resource-hub/       # Main dashboard
│   └── globals.css         # Global styles
├── components/             # React components
├── lib/                    # Core libraries
│   ├── auth.ts            # Authentication service
│   ├── database.ts        # Database setup
│   ├── adaptive-learning.ts # Learning engine
│   ├── digital-library.ts  # Library management
│   ├── sms-ussd.ts        # SMS/USSD integration
│   └── translations.ts    # Multilingual support
├── scripts/               # Database scripts
├── public/                # Static assets
└── data/                  # SQLite database files
```

## Key Components

### Resource Hub (`/resource-hub`)
The central dashboard featuring:
- Role-specific navigation and content
- Progress tracking with charts and analytics
- Quick access to lessons, library, and practice materials
- Achievement badges and streaks
- Recent activity feed

### Adaptive Learning Engine
- Tracks student mastery per concept
- Adjusts difficulty based on performance
- Provides personalized recommendations
- Records practice attempts and progress

### Digital Library
- Book checkout/return system
- Lesson-book pairing
- Reading progress tracking
- Overdue book management

### SMS/USSD Integration
- SMS lesson delivery
- Interactive quiz flows
- Progress reporting
- Parent/teacher access via USSD

### Multilingual Support
- 8 supported languages
- Interface translation
- Content translation system
- RTL language support

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Learning
- `GET /api/lessons` - Get lessons
- `GET /api/practice` - Get practice items
- `POST /api/practice/attempt` - Submit practice attempt
- `GET /api/progress` - Get student progress

### Library
- `GET /api/books` - Get books
- `POST /api/books/checkout` - Checkout book
- `POST /api/books/return` - Return book
- `GET /api/books/my-checkouts` - Get user's checkouts

### SMS/USSD
- `POST /api/sms/send` - Send SMS
- `POST /api/ussd/process` - Process USSD request

## Offline Functionality

The app works offline through:
- Service worker caching
- Background sync for data updates
- Local SQLite storage
- Offline-first architecture

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
JWT_SECRET=your-production-secret
SMS_GATEWAY_URL=your-production-sms-gateway
SMS_GATEWAY_API_KEY=your-production-api-key
NODE_ENV=production
```

### PWA Installation
The app can be installed as a PWA on supported devices:
- Mobile: Add to home screen
- Desktop: Install via browser prompt
- Offline functionality available after installation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Video lesson support
- [ ] Collaborative learning features
- [ ] Advanced SMS/USSD flows
- [ ] Mobile app development
- [ ] Integration with external LMS systems
- [ ] Advanced accessibility features
- [ ] Performance optimizations