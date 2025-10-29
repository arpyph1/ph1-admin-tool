@echo off
echo 🚀 Setting up PH1 Prompt-Driven Website System...
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating environment file...
    copy .env.example .env.local
    echo ✅ Created .env.local from template
    echo ⚠️  Please add your OpenAI API key to .env.local
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Setup complete! Here's what to do next:
echo ==========================================
echo.
echo 1. Add your OpenAI API key to .env.local:
echo    OPENAI_API_KEY=your_key_here
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. Open your browser to:
echo    - Homepage: http://localhost:3000
echo    - Admin Panel: http://localhost:3000/admin
echo.
echo 4. Start with these prompts:
echo    - 'Import content from PH1.ca'
echo    - 'Make homepage more enterprise-focused'
echo    - 'Add pricing calculator to services'
echo.
echo 🚀 Ready to transform your website with prompts!
pause
