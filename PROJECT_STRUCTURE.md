# Project Structure Documentation

## Overview
This project has been reorganized into three main sections for improved readability and development team workflow:

- **Backend**: Server-side logic, APIs, and services
- **Frontend**: Client-side components, pages, and assets
- **Data**: Configuration files, scripts, and database-related files

## Directory Structure

```
321-Group-Project-2/
├── backend/                    # Backend Development
│   ├── api/                    # API Routes & Endpoints
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── me/
│   │   │   └── register/
│   │   ├── books/             # Book management endpoints
│   │   │   ├── checkout/
│   │   │   ├── my-checkouts/
│   │   │   └── return/
│   │   ├── practice/          # Practice system endpoints
│   │   │   └── attempt/
│   │   └── progress/          # Progress tracking endpoints
│   ├── middleware/            # Middleware & Authentication
│   │   ├── auth.ts           # Authentication logic
│   │   ├── middleware.ts     # Request middleware
│   │   └── sms-ussd.ts       # SMS/USSD integration
│   └── services/             # Business Logic Services
│       ├── adaptive-learning.ts  # Adaptive learning algorithms
│       ├── database.ts       # Database operations
│       ├── digital-library.ts    # Library management
│       └── translations.ts   # Translation services
│
├── frontend/                   # Frontend Development
│   ├── components/            # Reusable UI Components
│   │   ├── AuthProvider.tsx  # Authentication context
│   │   └── PWARegistration.tsx # PWA registration
│   ├── pages/                 # Application Pages
│   │   ├── index.html        # Main application page
│   │   ├── dashboard.html    # Dashboard page
│   │   ├── database-viewer.html # Database viewer
│   │   ├── offline/          # Offline functionality
│   │   ├── resource-hub/     # Resource hub page
│   │   ├── page.tsx          # Next.js main page
│   │   └── layout.tsx        # Next.js layout
│   ├── styles/               # Styling Files
│   │   └── globals.css       # Global CSS styles
│   └── assets/               # Static Assets
│       ├── manifest.json     # PWA manifest
│       └── sw.js            # Service worker
│
├── data/                      # Data & Configuration
│   ├── scripts/              # Database & Setup Scripts
│   │   ├── migrate.ts        # Database migration
│   │   ├── seed.ts           # Database seeding
│   │   └── setup.sh          # Project setup script
│   ├── config/               # Configuration Files
│   │   ├── next.config.js    # Next.js configuration
│   │   ├── tsconfig.json     # TypeScript configuration
│   │   ├── package.json      # Dependencies & scripts
│   │   ├── postcss.config.js # PostCSS configuration
│   │   ├── tailwind.config.js # Tailwind CSS configuration
│   │   └── env.example       # Environment variables template
│   └── database/             # Database Files (if any)
│
├── README.md                  # Project documentation
├── IMPLEMENTATION_SUMMARY.md  # Implementation details
└── PROJECT_STRUCTURE.md      # This file
```

## Development Team Workflow

### Backend Developers
- Work primarily in the `backend/` directory
- Focus on API development, middleware, and business logic
- Use `backend/api/` for route definitions
- Use `backend/services/` for business logic
- Use `backend/middleware/` for authentication and request processing

### Frontend Developers
- Work primarily in the `frontend/` directory
- Focus on UI components, pages, and user experience
- Use `frontend/components/` for reusable UI elements
- Use `frontend/pages/` for application screens
- Use `frontend/styles/` for styling
- Use `frontend/assets/` for static resources

### DevOps/Data Engineers
- Work with files in the `data/` directory
- Manage configuration files in `data/config/`
- Handle database scripts in `data/scripts/`
- Set up project environment using `data/scripts/setup.sh`

## Key Benefits

1. **Clear Separation of Concerns**: Each section has a specific purpose
2. **Improved Collaboration**: Team members can work in their respective areas
3. **Better Maintainability**: Related files are grouped together
4. **Easier Onboarding**: New developers can quickly understand the structure
5. **Reduced Conflicts**: Less chance of merge conflicts between different teams

## Migration Notes

- All original functionality has been preserved
- File paths in imports may need to be updated
- Configuration files have been moved to `data/config/`
- Database scripts are now in `data/scripts/`
- Main application files are in `frontend/pages/`

## Next Steps

1. Update import paths in all files to reflect new structure
2. Update build scripts to reference new file locations
3. Update documentation to reflect new paths
4. Test all functionality to ensure nothing is broken
5. Update CI/CD pipelines if applicable
