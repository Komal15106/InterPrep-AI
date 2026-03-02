@echo off
cd /d "c:\Users\HP\OneDrive\Desktop\AI PREP\ai\ai\server"
echo Installing dependencies...
call npm install
echo Starting server...
node index.js
pause
