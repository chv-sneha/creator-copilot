@echo off
echo ========================================
echo Deploying Thumbnail Generator Lambda
echo ========================================

cd lambda

echo.
echo Creating deployment package...
powershell -Command "Compress-Archive -Path thumbnailGenerator.mjs -DestinationPath thumbnailGenerator.zip -Force"

echo.
echo Uploading to AWS Lambda...
aws lambda update-function-code ^
  --function-name thumbnailGenerator ^
  --zip-file fileb://thumbnailGenerator.zip ^
  --region us-east-1

echo.
echo Cleaning up...
del thumbnailGenerator.zip

cd ..

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
pause
