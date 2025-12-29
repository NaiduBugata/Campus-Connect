@echo off
echo ========================================
echo   CAMPUS CONNECT BACKEND DEPLOYMENT
echo ========================================
echo.

echo Step 1: MongoDB Atlas Setup
echo ----------------------------
echo Visit: https://www.mongodb.com/cloud/atlas
echo.
echo Create FREE M0 cluster, then come back here.
echo.
pause

echo.
echo Step 2: Enter MongoDB URI
echo -------------------------
set /p MONGODB_URI="Paste your MongoDB URI: "

echo.
echo Step 3: Generate JWT Secret
echo ---------------------------
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" > temp_secret.txt
set /p JWT_SECRET=<temp_secret.txt
del temp_secret.txt
echo JWT Secret Generated: %JWT_SECRET%

echo.
echo Step 4: Enter Frontend URL
echo --------------------------
set /p FRONTEND_URL="Enter your Vercel frontend URL (or press Enter for default): "
if "%FRONTEND_URL%"=="" set FRONTEND_URL=https://campus-connect.vercel.app

echo.
echo Step 5: Deploying to Vercel...
echo ------------------------------
vercel --prod ^
  -e MONGODB_URI="%MONGODB_URI%" ^
  -e JWT_SECRET="%JWT_SECRET%" ^
  -e JWT_EXPIRE="7d" ^
  -e FRONTEND_URL="%FRONTEND_URL%" ^
  -e CLIENT_URL="%FRONTEND_URL%" ^
  -e WEBPUSHR_PUBLIC_KEY="683978b545bedb748e1a5a1e5fdb0a79" ^
  -e WEBPUSHR_AUTH_TOKEN="117308" ^
  -e NODE_ENV="production" ^
  --yes

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your backend is now deployed!
echo Copy the Vercel URL and use it in your frontend .env
echo.
pause
