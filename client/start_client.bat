@echo off
cd /d "c:\Users\HP\OneDrive\Desktop\AI PREP\ai\ai\client"
echo Installing dependencies...
call npm install
echo Starting client...
npm run dev
pause
