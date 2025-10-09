#!/bin/bash

# AQE Database Setup Script
echo "🚀 Setting up Accessible Quality Education (AQE) Database..."

# Create data directory if it doesn't exist
mkdir -p data

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
JWT_SECRET=your-secret-key-here-change-in-production
SMS_GATEWAY_URL=https://api.sms-gateway.com/send
SMS_GATEWAY_API_KEY=your-sms-api-key
NODE_ENV=development
DATABASE_PATH=./data/aqe.db
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi

# Run database migration
echo "🗄️ Running database migration..."
npm run db:migrate

# Run database seeding
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Use demo accounts to explore different roles:"
echo "   - Student: student@demo.com / demo123"
echo "   - Teacher: teacher@demo.com / demo123"
echo "   - Parent: parent@demo.com / demo123"
echo "   - Admin: admin@demo.com / demo123"
echo ""
echo "📁 Database location: ./data/aqe.db"
echo "📊 View database: Open database-viewer.html in your browser"
echo ""
echo "🔗 HTML Pages created:"
echo "   - index.html (Home/Onboarding page)"
echo "   - dashboard.html (Main dashboard)"
echo "   - database-viewer.html (Database viewer)"
echo ""
echo "Happy learning! 🎓"
