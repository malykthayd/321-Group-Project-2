# 🎓 Accessible Quality Education Platform

## 📁 Project Structure (Simplified & Intuitive)

This project follows **standard web development conventions** for easy understanding and collaboration.

```
321-Group-Project-2/
├── 📄 index.html              # 🏠 MAIN APPLICATION FILE
├── 📄 dashboard.html          # 📊 Dashboard page
├── 📄 database-viewer.html     # 🗄️ Database viewer
├── 📁 src/                    # 💻 Source Code
│   ├── 📁 components/         # 🧩 Reusable UI Components
│   │   ├── AuthProvider.tsx   # Authentication context
│   │   └── PWARegistration.tsx # PWA registration
│   ├── 📁 pages/              # 📄 Application Pages
│   │   ├── page.tsx           # Next.js main page
│   │   ├── layout.tsx         # Next.js layout
│   │   ├── offline/           # Offline functionality
│   │   └── resource-hub/      # Resource hub page
│   ├── 📁 styles/             # 🎨 Styling Files
│   │   └── globals.css        # Global CSS styles
│   ├── 📁 services/           # ⚙️ Business Logic
│   │   ├── auth.ts            # Authentication logic
│   │   ├── database.ts        # Database operations
│   │   ├── digital-library.ts # Library management
│   │   ├── translations.ts    # Translation services
│   │   ├── adaptive-learning.ts # Learning algorithms
│   │   └── middleware.ts      # Request middleware
│   └── 📁 utils/              # 🛠️ Utility Functions
│       ├── migrate.ts         # Database migration
│       ├── seed.ts            # Database seeding
│       └── setup.sh           # Project setup
├── 📁 public/                 # 🌐 Static Assets
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── 📁 config/                 # ⚙️ Configuration Files
│   ├── package.json           # Dependencies & scripts
│   ├── next.config.js         # Next.js configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── env.example            # Environment variables template
└── 📄 Documentation Files     # 📚 Project Documentation
    ├── README.md              # Project overview & quick start
    ├── PROJECT_STRUCTURE.md   # This file
    ├── MIGRATION_GUIDE.md    # Migration instructions
    └── IMPLEMENTATION_SUMMARY.md # Implementation details
```

## 🎯 How to Add Content (Developer Guide)

### **For Frontend Developers:**
- **Main App**: Edit `index.html` (this is your primary file)
- **Components**: Add reusable components in `src/components/`
- **Styles**: Add CSS in `src/styles/globals.css`
- **Pages**: Add new pages in `src/pages/`

### **For Backend Developers:**
- **API Logic**: Add business logic in `src/services/`
- **Database**: Modify `src/services/database.ts`
- **Authentication**: Update `src/services/auth.ts`
- **Utilities**: Add helper functions in `src/utils/`

### **For Configuration:**
- **Dependencies**: Update `config/package.json`
- **Build Settings**: Modify `config/next.config.js`
- **Styling**: Update `config/tailwind.config.js`

## 🔗 How Files Connect

### **Main Application Flow:**
```
index.html (Main App)
├── Uses components from src/components/
├── Imports styles from src/styles/
├── Calls services from src/services/
└── Loads assets from public/
```

### **Component Structure:**
```
src/components/
├── AuthProvider.tsx → Handles user authentication
└── PWARegistration.tsx → Manages PWA features
```

### **Service Layer:**
```
src/services/
├── auth.ts → User authentication & login
├── database.ts → Data storage & retrieval
├── digital-library.ts → Book management
└── translations.ts → Multi-language support
```

## 🚀 Getting Started

### **1. Main Application**
- **Start here**: `index.html` contains the complete application
- **All features**: Digital Library, Progress Tracking, Practice Materials
- **Self-contained**: Everything works from this single file

### **2. Adding New Features**
- **UI Components**: Add to `src/components/`
- **Business Logic**: Add to `src/services/`
- **Styling**: Add to `src/styles/globals.css`
- **Pages**: Add to `src/pages/`

### **3. Configuration**
- **Dependencies**: Update `config/package.json`
- **Environment**: Copy `config/env.example` to `.env`
- **Build**: Run commands from `config/package.json`

## 💡 Key Benefits

✅ **Simple Structure**: Easy to understand and navigate
✅ **Standard Conventions**: Follows web development best practices
✅ **Clear Separation**: Frontend, backend, and config are distinct
✅ **Easy Collaboration**: Team members know exactly where to add content
✅ **Self-Contained**: Main app works independently
✅ **Extensible**: Easy to add new features and components

## 🎯 Development Workflow

1. **Main Development**: Work primarily with `index.html`
2. **Component Development**: Add reusable components to `src/components/`
3. **Service Development**: Add business logic to `src/services/`
4. **Styling**: Update `src/styles/globals.css`
5. **Configuration**: Modify files in `config/`

## 📞 Need Help?

- **Main App**: Everything is in `index.html` - start there!
- **Components**: Look in `src/components/` for reusable UI elements
- **Services**: Check `src/services/` for business logic
- **Configuration**: All config files are in `config/`

This structure is designed to be **intuitive and standard** - no confusion, just clear organization! 🎉