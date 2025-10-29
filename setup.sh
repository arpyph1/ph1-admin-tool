#!/bin/bash

echo "🚀 Setting up PH1 Prompt-Driven Website System..."
echo "=================================================="

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

echo "✅ Node.js and npm detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please add your OpenAI API key to .env.local"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup complete! Here's what to do next:"
echo "=========================================="
echo ""
echo "1. Add your OpenAI API key to .env.local:"
echo "   OPENAI_API_KEY=your_key_here"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   - Homepage: http://localhost:3000"
echo "   - Admin Panel: http://localhost:3000/admin"
echo ""
echo "4. Start with these prompts:"
echo "   - 'Import content from PH1.ca'"
echo "   - 'Make homepage more enterprise-focused'"
echo "   - 'Add pricing calculator to services'"
echo ""
echo "🚀 Ready to transform your website with prompts!"
